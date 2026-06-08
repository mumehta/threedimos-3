/* reef.jsx — underwater reef hero scene (Three.js, photoreal-ish 2.5D diorama)
  Layered water + god rays + caustics, lit seafloor, muted coral, kelp, and
  drifting marine snow + bubbles. Mouse stirs a current; double-click bursts
  bubbles. Exports <Reef/>. Tuned to stay dark/cinematic behind hero text. */

import React from 'react';

const REEF_VIDEO_SOURCES = [
  'https://commons.wikimedia.org/wiki/Special:FilePath/Tropical_Fish_Banner_Fish_on_Coral_Reef.webm',
];

function reefHex(hex){
  const h = String(hex).replace('#','');
  const x = h.length === 3 ? h.replace(/./g,c=>c+c) : h;
  const n = parseInt(x.slice(0,6),16);
  return [((n>>16)&255)/255, ((n>>8)&255)/255, (n&255)/255];
}

const TAU = Math.PI * 2;

function clamp(v, min, max){
  return Math.max(min, Math.min(max, v));
}

function mixColor(a, b, t){
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function scaleColor(c, s){
  return [c[0] * s, c[1] * s, c[2] * s];
}

function randomRange(min, max){
  return min + Math.random() * (max - min);
}

/* ---------- shaders ---------- */
const REEF_BG_VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;

const REEF_BG_FRAG = `
  precision highp float;
  uniform float uTime; uniform float uMouse; uniform float uAspect;
  uniform vec3 uDeep; uniform vec3 uShallow; uniform vec3 uLight; uniform vec3 uSand;
  varying vec2 vUv;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
    float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
    return mix(mix(a,b,f.x), mix(c,d,f.x), f.y); }
  float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.03; a*=0.5; } return v; }
  void main(){
    vec2 uv = vUv;
    float depth = pow(clamp(uv.y,0.0,1.0), 1.55);
    vec3 col = mix(uDeep, uShallow, depth);

    float lightBand = smoothstep(0.0, 0.28, uv.y);
    float shafts = 0.0;
    for(int i=0;i<4;i++){
      float fi = float(i);
      float cx = 0.5 + (fi-1.5)*0.18 + sin(uTime*0.04 + fi*1.4)*0.04 + uMouse*0.04;
      float band = abs((uv.x*uAspect*0.5+0.5) - cx + (1.0-uv.y)*0.08);
      shafts += smoothstep(0.14, 0.0, band) * (0.35 + fi*0.12);
    }
    col += uLight * shafts * 0.07 * lightBand;

    float caustic = fbm(vec2(uv.x*uAspect*3.4, uv.y*4.2) + vec2(uTime*0.02, -uTime*0.03));
    float caustic2 = fbm(vec2(uv.x*uAspect*7.0, uv.y*7.2) - vec2(uTime*0.035, uTime*0.025));
    col += uLight * smoothstep(0.58, 0.98, caustic*0.62+caustic2*0.38) * 0.08 * lightBand;

    float haze = fbm(vec2(uv.x*uAspect*1.6, uv.y*2.4) + vec2(uTime*0.008, uTime*0.01));
    col += vec3(0.015, 0.03, 0.04) * haze * (1.0 - uv.y) * 0.35;

    float sand = smoothstep(0.34, 0.04, uv.y);
    col = mix(col, uSand, sand * 0.58);

    float floorFade = smoothstep(0.1, 0.78, uv.y);
    col *= mix(0.45, 1.0, floorFade);
    col -= vec3(0.035, 0.04, 0.04) * (1.0 - floorFade);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const KELP_VERT = `
  uniform float uTime; uniform float uCurrent; uniform float uPhase; uniform float uH; uniform float uStiff;
  varying float vY;
  void main(){
    vec3 p = position;
    float h = clamp(p.y/uH + 0.5, 0.0, 1.0);
    p.x *= (1.0 - h*0.55);                          // taper toward the tip
    float sway = sin(uTime*1.1 + uPhase + h*3.2) * 0.05 * h*h;
    sway += uCurrent * h*h * uStiff;                // mouse current bends the tip
    p.x += sway;
    p.z += cos(uTime*0.9 + uPhase + h*2.0) * 0.02 * h;
    vY = h;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0);
  }
`;
const KELP_FRAG = `
  precision highp float;
  uniform vec3 uColA; uniform vec3 uColB; uniform float uAlpha;
  varying float vY;
  void main(){
    vec3 c = mix(uColA, uColB, vY);
    float a = (1.0 - smoothstep(0.82, 1.0, vY)) * (0.5 + 0.5*vY);
    gl_FragColor = vec4(c, a*uAlpha);
  }
`;

/* ---------- sprite textures ---------- */
function makeDotTex(){
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'); const grd = g.createRadialGradient(32,32,0,32,32,32);
  grd.addColorStop(0,'rgba(255,255,255,1)'); grd.addColorStop(0.4,'rgba(220,250,255,0.5)'); grd.addColorStop(1,'rgba(220,250,255,0)');
  g.fillStyle = grd; g.fillRect(0,0,64,64);
  const t = new THREE.CanvasTexture(c); return t;
}
function makeBubbleTex(){
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d');
  g.strokeStyle = 'rgba(190,235,255,0.72)'; g.lineWidth = 2.2; g.beginPath(); g.arc(32,32,22,0,Math.PI*2); g.stroke();
  g.strokeStyle = 'rgba(255,255,255,0.72)'; g.lineWidth = 2.8; g.beginPath(); g.arc(24,22,7,Math.PI*0.9,Math.PI*1.7); g.stroke();
  const grd = g.createRadialGradient(32,32,10,32,32,26);
  grd.addColorStop(0,'rgba(120,210,235,0.0)'); grd.addColorStop(1,'rgba(120,210,235,0.08)');
  g.fillStyle = grd; g.beginPath(); g.arc(32,32,24,0,Math.PI*2); g.fill();
  const t = new THREE.CanvasTexture(c); return t;
}


function Reef({ colors, motion, theme }){
  const wrapRef = React.useRef(null);
  const propsRef = React.useRef({ colors, motion, theme });
  propsRef.current = { colors, motion, theme };
  const liveRef = React.useRef(null);
  const [videoSourceIndex, setVideoSourceIndex] = React.useState(0);

  const useProceduralFallback = videoSourceIndex >= REEF_VIDEO_SOURCES.length;

  React.useEffect(()=>{
    if (!useProceduralFallback) return;

    const wrap = wrapRef.current;
    if (!wrap || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, powerPreference:'high-performance' });
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.88;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x061018, 0.085);
    let aspect = 1.6;
    const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, -10, 10);
    camera.position.z = 5;

    const accents = () => (propsRef.current.colors || ['#7c5cff','#22d3ee','#ff4d9d']).map(reefHex);

    const naturalCoral = [
      [0.30, 0.18, 0.14],
      [0.55, 0.28, 0.18],
      [0.72, 0.40, 0.26],
      [0.82, 0.68, 0.48],
    ];
    const kelpBand = [
      [0.04, 0.10, 0.08],
      [0.06, 0.24, 0.16],
      [0.11, 0.42, 0.26],
    ];

    const skyLight = new THREE.HemisphereLight(0xaad6ff, 0x102028, 1.0);
    scene.add(skyLight);
    const sun = new THREE.DirectionalLight(0xfef0dc, 1.45);
    sun.position.set(-1.4, 2.4, 3.2);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0x7bc8ff, 0.55);
    fill.position.set(2.4, 0.6, 2.1);
    scene.add(fill);
    const bottomGlow = new THREE.AmbientLight(0x0d1d26, 0.55);
    scene.add(bottomGlow);

    // ---- background ----
    const bgUniforms = {
      uTime:{value:0}, uMouse:{value:0}, uAspect:{value:aspect},
      uDeep:   { value: new THREE.Vector3(0.012,0.05,0.075) },
      uShallow:{ value: new THREE.Vector3(0.072,0.18,0.23) },
      uLight:  { value: new THREE.Vector3(0.58,0.85,0.98) },
      uSand:   { value: new THREE.Vector3(0.2,0.22,0.19) },
    };
    const bg = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 3.2),
      new THREE.ShaderMaterial({ uniforms:bgUniforms, vertexShader:REEF_BG_VERT, fragmentShader:REEF_BG_FRAG, depthWrite:false })
    );
    bg.position.z = -4; scene.add(bg);

    // ---- distant seafloor / reef silhouette ----
    const floorGeo = new THREE.PlaneGeometry(8.6, 2.2, 180, 24);
    const floorPos = floorGeo.attributes.position;
    const floorData = [];
    for(let i=0;i<floorPos.count;i++){
      const x = floorPos.getX(i);
      const y = floorPos.getY(i);
      const ridge = Math.sin(x*1.05) * 0.08 + Math.sin(x*2.8 + 1.3) * 0.05 + Math.sin(x*6.2 - 0.5) * 0.016;
      const mound = Math.exp(-Math.pow((x+1.9)/1.35, 2)) * 0.22 + Math.exp(-Math.pow((x-1.8)/1.1, 2)) * 0.18;
      const dip = -0.75 + y * 0.02;
      const depth = ridge + mound + dip;
      floorPos.setZ(i, depth);
      floorData.push(depth);
    }
    floorGeo.computeVertexNormals();
    const floorMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x5f5b4d),
      roughness: 1,
      metalness: 0,
      flatShading: false,
      transparent: true,
      opacity: 0.98,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -0.12;
    floor.position.set(0, -1.02, -0.9);
    scene.add(floor);

    const sandCap = new THREE.Mesh(
      new THREE.PlaneGeometry(8.9, 0.95, 120, 6),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x7d735f),
        roughness: 1,
        metalness: 0,
        transparent: true,
        opacity: 0.55,
      })
    );
    sandCap.rotation.x = -0.16;
    sandCap.position.set(0, -0.98, -0.65);
    scene.add(sandCap);

    // ---- groups for parallax ----
    const farG = new THREE.Group();  farG.position.z = -2;
    const midG = new THREE.Group();  midG.position.z = 0;
    const nearG = new THREE.Group(); nearG.position.z = 2;
    scene.add(farG, midG, nearG);

    // ---- coral mounds (organic, lit, and muted) ----
    function coralMound(x, scale, colIdx, group){
      const g = new THREE.Group();
      const cs = accents();
      const accent = cs[colIdx % 3];
      const n = 11 + Math.floor(Math.random()*6);
      for(let i=0;i<n;i++){
        const r = (0.08 + Math.random()*0.14) * scale;
        const cx = (Math.random()-0.5)*0.55*scale;
        const cy = Math.random()*0.3*scale;
        const cz = (Math.random()-0.5)*0.12*scale;
        const kind = i % 3;
        const tint = mixColor(naturalCoral[(colIdx + kind) % naturalCoral.length], accent, 0.15);
        const base = new THREE.MeshStandardMaterial({
          color: new THREE.Color(...scaleColor(tint, 0.9)),
          roughness: 0.94,
          metalness: 0,
        });
        const top = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), base);
        top.position.set(cx, cy, cz);
        top.rotation.set(Math.random()*0.9, Math.random()*0.9, Math.random()*TAU);
        top.scale.set(0.95 + Math.random()*0.45, 0.72 + Math.random()*0.55, 0.72 + Math.random()*0.45);
        g.add(top);

        const shade = new THREE.MeshStandardMaterial({
          color: new THREE.Color(...scaleColor(tint, 0.5)),
          roughness: 1,
          metalness: 0,
          transparent: true,
          opacity: 0.65,
        });
        const core = new THREE.Mesh(new THREE.IcosahedronGeometry(r*0.7, 0), shade);
        core.position.set(cx - r*0.08, cy - r*0.04, cz - r*0.03);
        core.scale.set(1.1, 0.95, 0.9);
        g.add(core);

        if (Math.random() > 0.55){
          const highlight = new THREE.MeshStandardMaterial({
            color: new THREE.Color(...mixColor(tint, [0.98, 0.84, 0.68], 0.5)),
            roughness: 0.88,
            metalness: 0,
            transparent: true,
            opacity: 0.58,
          });
          const cap = new THREE.Mesh(new THREE.IcosahedronGeometry(r*0.48, 0), highlight);
          cap.position.set(cx + r*0.16, cy + r*0.16, cz + r*0.06);
          cap.scale.set(0.7, 0.56, 0.58);
          g.add(cap);
        }
      }
      g.position.set(x, -0.98, 0);
      g.userData.phase = Math.random()*6.28;
      group.add(g);
      return g;
    }

    // ---- branch / staghorn coral (more natural, less graphic) ----
    function branchCoral(x, scale, colIdx, group){
      const g = new THREE.Group();
      const cs = accents(); const base = mixColor(naturalCoral[(colIdx + 1) % naturalCoral.length], cs[colIdx % 3], 0.12);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(...scaleColor(base, 0.95)),
        roughness: 0.92,
        metalness: 0,
      });
      const arms = 5 + Math.floor(Math.random()*3);
      for(let i=0;i<arms;i++){
        const ang = (i/(arms-1) - 0.5) * 1.5;
        const len = (0.42 + Math.random()*0.58) * scale;
        const geo = new THREE.CylinderGeometry(0.018*scale, 0.06*scale, len, 6, 1, false);
        const arm = new THREE.Mesh(geo, mat);
        arm.position.set(Math.sin(ang)*0.08, len/2, 0);
        arm.rotation.z = -ang;
        arm.rotation.x = (Math.random()-0.5)*0.15;
        g.add(arm);
      }
      g.position.set(x, -0.98, 0);
      g.userData.phase = Math.random()*6.28;
      group.add(g);
      return g;
    }

    // ---- kelp / seagrass blades ----
    const kelp = [];
    function addKelp(x, height, group, opts){
      const geo = new THREE.PlaneGeometry(0.11*(opts.w||1), height, 1, 16);
      const cA = opts.colA, cB = opts.colB;
      const mat = new THREE.ShaderMaterial({
        uniforms:{ uTime:{value:0}, uCurrent:{value:0}, uPhase:{value:Math.random()*6.28},
          uH:{value:height}, uStiff:{value:opts.stiff||0.5},
          uColA:{value:new THREE.Vector3(...cA)}, uColB:{value:new THREE.Vector3(...cB)}, uAlpha:{value:opts.alpha||0.9} },
        vertexShader:KELP_VERT, fragmentShader:KELP_FRAG, transparent:true, depthWrite:false, side:THREE.DoubleSide
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, -1.0 + height/2, 0);
      group.add(m); kelp.push(mat);
    }

    function buildFlora(){
      const cs = accents();
      const greenA = [0.03,0.11,0.08], greenB = [0.12,0.45,0.26];
      const kelpDarkA = [0.02,0.06,0.08], kelpDarkB = [0.06,0.18,0.16];

      // far silhouette kelp (dark, atmospheric)
      for(let i=0;i<20;i++){
        const x = -3.3 + Math.random()*6.6;
        addKelp(x, 0.55+Math.random()*0.65, farG, { colA:kelpDarkA, colB:kelpDarkB, alpha:0.62, stiff:0.22, w:0.8 });
      }
      // mid layer: natural grass and more muted reef growth
      for(let i=0;i<30;i++){
        const x = -3.2 + Math.random()*6.4;
        const accent = Math.random() < 0.22;
        const c = cs[Math.floor(Math.random()*3)];
        addKelp(x, 0.52+Math.random()*0.88, midG, accent
          ? { colA:[c[0]*0.1,c[1]*0.14,c[2]*0.12], colB:mixColor(c, [0.52,0.74,0.62], 0.18), alpha:0.7, stiff:0.42, w:0.95 }
          : { colA:greenA, colB:greenB, alpha:0.82, stiff:0.52, w:1 });
      }

      // coral mounds + branches across the bed, but kept subdued
      coralMound(-2.2, 0.92, 0, midG);
      coralMound(-1.0, 0.75, 1, midG);
      coralMound(-0.35, 0.68, 2, midG);
      coralMound(1.05, 0.82, 0, midG);
      coralMound(1.86, 1.0, 1, midG);
      branchCoral(-1.3, 0.92, 2, midG);
      branchCoral(0.72, 0.82, 0, midG);
      branchCoral(2.42, 0.92, 1, midG);

      // near foreground (slightly larger, softer silhouettes)
      for(let i=0;i<8;i++){
        const x = -3.1 + Math.random()*6.2;
        addKelp(x, 0.72+Math.random()*0.72, nearG, { colA:[0.01,0.04,0.05], colB:[0.04,0.13,0.11], alpha:0.88, stiff:0.68, w:1.2 });
      }
      coralMound(-2.75, 1.0, 1, nearG);
      coralMound(2.82, 1.08, 0, nearG);
    }
    buildFlora();

    // ---- marine snow ----
    const SNOW = 300;
    const sgeo = new THREE.BufferGeometry();
    const spos = new Float32Array(SNOW*3); const ssp = new Float32Array(SNOW);
    for(let i=0;i<SNOW;i++){
      spos[i*3]=(Math.random()-0.5)*6.4; spos[i*3+1]=(Math.random()-0.5)*2.4; spos[i*3+2]=(Math.random()-0.5)*3;
      ssp[i]=0.4+Math.random();
    }
    sgeo.setAttribute('position', new THREE.BufferAttribute(spos,3));
    const snow = new THREE.Points(sgeo, new THREE.PointsMaterial({ map:makeDotTex(), size:4.2, color:0x9ad8e9,
      transparent:true, opacity:0.45, depthWrite:false, blending:THREE.AdditiveBlending, sizeAttenuation:false }));
    scene.add(snow);

    // ---- bubbles (ambient + burst) ----
    const BUB = 70;
    const bgeo = new THREE.BufferGeometry();
    const bpos = new Float32Array(BUB*3); const bvel = new Float32Array(BUB*2); const bsize = new Float32Array(BUB);
    const blife = new Float32Array(BUB);
    function spawnBubble(i, x, y, burst){
      bpos[i*3]=x; bpos[i*3+1]=y; bpos[i*3+2]=(Math.random()-0.5)*2.5;
      bvel[i*2]= (Math.random()-0.5)*(burst?1.4:0.14);
      bvel[i*2+1]= burst ? (0.5+Math.random()*1.3) : (0.18+Math.random()*0.22);
      bsize[i]= (burst?0.05:0.03)+Math.random()*0.05;
      blife[i]= 1;
    }
    for(let i=0;i<BUB;i++){ spawnBubble(i, (Math.random()-0.5)*6, -1+Math.random()*2, false); }
    bgeo.setAttribute('position', new THREE.BufferAttribute(bpos,3));
    const bubbles = new THREE.Points(bgeo, new THREE.PointsMaterial({ map:makeBubbleTex(), size:18, color:0xc4e8f5,
      transparent:true, opacity:0.62, depthWrite:false, blending:THREE.AdditiveBlending, sizeAttenuation:false }));
    scene.add(bubbles);

    // ---- sizing ----
    const resize = ()=>{
      const w = wrap.clientWidth||1, h = wrap.clientHeight||1; aspect = w/h;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
      renderer.setSize(w,h,false);
      camera.left=-aspect; camera.right=aspect; camera.top=1; camera.bottom=-1; camera.updateProjectionMatrix();
      bgUniforms.uAspect.value = aspect;
    };
    wrap.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block';
    resize();
    const ro = new ResizeObserver(resize); ro.observe(wrap);

    // ---- interaction ----
    const mouse = { x:0, y:0 };
    const cur = { x:0, y:0 };
    let current = 0, targetCurrent = 0;
    const onMove = (e)=>{ mouse.x=(e.clientX/window.innerWidth)*2-1; mouse.y=(e.clientY/window.innerHeight)*2-1; };
    window.addEventListener('pointermove', onMove);

    const isUI = (el)=> el && el.closest && el.closest('a,button,input,select,textarea,[data-omelette-chrome]');
    let dragging=false, lastX=0;
    const onDown = (e)=>{ if(e.button!==0 || isUI(e.target)) return; dragging=true; lastX=e.clientX; };
    const onDrag = (e)=>{ if(!dragging) return; const dx=e.clientX-lastX; lastX=e.clientX; targetCurrent += dx*0.0009; targetCurrent=Math.max(-0.5,Math.min(0.5,targetCurrent)); };
    const onUp = ()=>{ dragging=false; };
    const toWorld = (clientX, clientY)=>{
      const r = renderer.domElement.getBoundingClientRect();
      const nx = ((clientX-r.left)/r.width)*2-1, ny = -(((clientY-r.top)/r.height)*2-1);
      return { x: nx*aspect, y: ny };
    };
    let burstFlash = 0;
    const onDbl = (e)=>{
      if(isUI(e.target)) return;
      const w = toWorld(e.clientX, e.clientY);
      let launched=0;
      for(let i=0;i<BUB && launched<28;i++){ if(blife[i]<0.15 || bpos[i*3+1]>0.9){ spawnBubble(i, w.x+(Math.random()-0.5)*0.1, w.y, true); launched++; } }
      // if not enough idle bubbles, reuse lowest
      for(let i=0;i<BUB && launched<28;i++){ spawnBubble(i, w.x+(Math.random()-0.5)*0.1, w.y, true); launched++; }
      targetCurrent += (Math.random()-0.5)*0.4;
      burstFlash = 1;
    };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onDrag);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('dblclick', onDbl);

    // ---- loop ----
    let raf, last=performance.now(), tAcc=0, running=true;
    const onVis = ()=>{ running=!document.hidden; if(running){ last=performance.now(); loop(); } };
    document.addEventListener('visibilitychange', onVis);

    const loop = ()=>{
      if(!running) return;
      raf = requestAnimationFrame(loop);
      const now=performance.now(); const dt=Math.min((now-last)/1000,0.05); last=now;
      const m = propsRef.current.motion ?? 1;
      tAcc += dt * (0.5 + m*0.7);

      cur.x += (mouse.x-cur.x)*0.04; cur.y += (mouse.y-cur.y)*0.04;
      targetCurrent *= 0.96; current += (targetCurrent - current)*0.08;
      const liveCurrent = current + cur.x*0.12;
      burstFlash = Math.max(0, burstFlash - dt*1.4);

      bgUniforms.uTime.value = tAcc;
      bgUniforms.uMouse.value = cur.x;
      // light flash on burst
      bgUniforms.uLight.value.set(0.52+burstFlash*0.2, 0.8, 0.95);

      // parallax
      farG.position.x = cur.x*0.05; farG.position.y = -cur.y*0.02;
      midG.position.x = cur.x*0.12; midG.position.y = -cur.y*0.04;
      nearG.position.x = cur.x*0.24; nearG.position.y = -cur.y*0.06;

      // kelp sway
      for(let i=0;i<kelp.length;i++){ const u=kelp[i].uniforms; u.uTime.value=tAcc; u.uCurrent.value=liveCurrent; }
      // coral mound + branch gentle sway
      const swayGroups = [...midG.children, ...nearG.children];
      for(const g of swayGroups){ if(g.userData && g.userData.phase!==undefined){ g.rotation.z = Math.sin(tAcc*0.8 + g.userData.phase)*0.04 + liveCurrent*0.3; } }

      // marine snow drift
      for(let i=0;i<SNOW;i++){
        spos[i*3+1] += dt*0.03*ssp[i]*(0.6+m*0.6);
        spos[i*3]   += Math.sin(tAcc*0.5 + i)*0.0007 + liveCurrent*0.01;
        if(spos[i*3+1] > 1.3){ spos[i*3+1] = -1.3; spos[i*3]=(Math.random()-0.5)*6.4; }
      }
      sgeo.attributes.position.needsUpdate = true;

      // bubbles rise
      for(let i=0;i<BUB;i++){
        bpos[i*3]   += (bvel[i*2] + Math.sin(tAcc*2.0+i)*0.04 + liveCurrent*0.4)*dt;
        bpos[i*3+1] += bvel[i*2+1]*dt*(0.7+m*0.5);
        bvel[i*2+1] *= 0.992;
        if(bpos[i*3+1] > 1.25){ spawnBubble(i, (Math.random()-0.5)*6, -1.1, false); }
      }
      bgeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    loop();

    liveRef.current = { bgUniforms, kelp, accents, renderer };

    return ()=>{
      running=false; cancelAnimationFrame(raf); ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onDrag);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('dblclick', onDbl);
      document.removeEventListener('visibilitychange', onVis);
      scene.traverse(o=>{ if(o.geometry) o.geometry.dispose(); if(o.material){ if(o.material.map) o.material.map.dispose(); o.material.dispose(); } });
      renderer.dispose();
      if(renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      liveRef.current = null;
    };
  }, [useProceduralFallback]);

  return React.createElement(
    'div',
    { ref: wrapRef, id:'orb-canvas' },
    !useProceduralFallback
      ? React.createElement(
          React.Fragment,
          null,
          React.createElement('video', {
            key: REEF_VIDEO_SOURCES[videoSourceIndex],
            src: REEF_VIDEO_SOURCES[videoSourceIndex],
            autoPlay: true,
            loop: true,
            muted: true,
            playsInline: true,
            preload: 'auto',
            crossOrigin: 'anonymous',
            onError: () => setVideoSourceIndex((idx) => idx + 1),
            style: {
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'saturate(1.08) contrast(1.07) brightness(0.66)',
            },
          }),
          React.createElement('div', {
            'aria-hidden': 'true',
            style: {
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(120% 95% at 50% 8%, rgba(135,190,210,0.20), rgba(7,16,26,0.74) 62%, rgba(4,9,16,0.92) 100%)',
              pointerEvents: 'none',
            },
          })
        )
      : null
  );
}

export default Reef;
