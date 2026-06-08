/* orb.jsx — real-time WebGL gradient orb (the "Three Dimos" centerpiece)
   Morphing icosahedron + simplex-noise displacement + multi-color gradient
   + fresnel rim. Mouse-reactive, motion-intensity driven. Exports <Orb/>. */

import React from 'react';

function hexToRGB(hex){
  const h = String(hex).replace('#','');
  const x = h.length === 3 ? h.replace(/./g,c=>c+c) : h;
  const n = parseInt(x.slice(0,6),16);
  return [((n>>16)&255)/255, ((n>>8)&255)/255, (n&255)/255];
}

const ORB_VERT = `
  uniform float uTime;
  uniform float uAmp;
  uniform vec2  uMouse;
  varying float vNoise;
  varying vec3  vNormal;
  varying vec3  vView;

  // --- Ashima simplex noise 3D ---
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0,0.5,1.0,2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i,289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main(){
    float t = uTime;
    vec3 p = position;
    float n  = snoise(p * 1.15 + vec3(t*0.25, t*0.18, -t*0.2));
    float n2 = snoise(p * 2.6  + vec3(-t*0.4, t*0.3, t*0.22)) * 0.5;
    float disp = (n + n2) * uAmp;
    // mouse adds a directional bulge
    float md = snoise(p * 1.0 + vec3(uMouse * 2.0, t*0.1)) * (length(uMouse)) * 0.35;
    vec3 displaced = p + normal * (disp + md);
    vNoise = n + n2;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const ORB_FRAG = `
  precision highp float;
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uC;
  uniform float uGlow;
  varying float vNoise;
  varying vec3 vNormal;
  varying vec3 vView;

  void main(){
    float m = smoothstep(-1.0, 1.0, vNoise);
    vec3 col = mix(uA, uB, smoothstep(0.0, 0.65, m));
    col = mix(col, uC, smoothstep(0.55, 1.0, m));
    // fake key light
    vec3 L = normalize(vec3(0.4, 0.7, 0.6));
    float diff = clamp(dot(normalize(vNormal), L) * 0.5 + 0.45, 0.0, 1.0);
    col *= diff;
    // fresnel rim
    float fres = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0), 2.6);
    col += fres * uGlow * (uA + uC) * 0.32;
    col = pow(col, vec3(1.02)); // keep rich, avoid blowout
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Orb({ colors, motion, theme }){
  const wrapRef = React.useRef(null);
  const stateRef = React.useRef(null);
  const propsRef = React.useRef({ colors, motion, theme });
  propsRef.current = { colors, motion, theme };

  React.useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, powerPreference:'high-performance' });
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 6.6;

    const geo = new THREE.IcosahedronGeometry(1.55, 64);
    const [a,b,c] = (propsRef.current.colors || ['#7c5cff','#22d3ee','#ff4d9d']);
    const uniforms = {
      uTime:  { value: 0 },
      uAmp:   { value: 0.34 },
      uMouse: { value: new THREE.Vector2(0,0) },
      uA: { value: new THREE.Vector3(...hexToRGB(a)) },
      uB: { value: new THREE.Vector3(...hexToRGB(b)) },
      uC: { value: new THREE.Vector3(...hexToRGB(c)) },
      uGlow: { value: 0.9 },
    };
    const mat = new THREE.ShaderMaterial({ uniforms, vertexShader:ORB_VERT, fragmentShader:ORB_FRAG });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // faint companion wireframe shell for depth
    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.05, 1),
      new THREE.MeshBasicMaterial({ color:0xffffff, wireframe:true, transparent:true, opacity:0.05 })
    );
    scene.add(shell);

    // ── flare particles (double-click burst) ──
    const PCOUNT = 150;
    const pgeo = new THREE.BufferGeometry();
    const ppos = new Float32Array(PCOUNT*3);
    const pvel = new Float32Array(PCOUNT*3);
    const pcol = new Float32Array(PCOUNT*3);
    pgeo.setAttribute('position', new THREE.BufferAttribute(ppos, 3));
    pgeo.setAttribute('color', new THREE.BufferAttribute(pcol, 3));
    const pmat = new THREE.PointsMaterial({ size:0.06, vertexColors:true, transparent:true,
      opacity:0, blending:THREE.AdditiveBlending, depthWrite:false, sizeAttenuation:true });
    const points = new THREE.Points(pgeo, pmat);
    scene.add(points);
    let burst = 0;
    const fire = () => {
      burst = 1;
      const cs = (propsRef.current.colors || ['#7c5cff','#22d3ee','#ff4d9d']).map(hexToRGB);
      for (let i=0;i<PCOUNT;i++){
        const u = Math.random()*2-1, th = Math.random()*Math.PI*2, s = Math.sqrt(1-u*u);
        const dx = s*Math.cos(th), dy = s*Math.sin(th), dz = u, r = 1.5;
        ppos[i*3]=dx*r; ppos[i*3+1]=dy*r; ppos[i*3+2]=dz*r;
        const sp = 1.8 + Math.random()*3.0;
        pvel[i*3]=dx*sp; pvel[i*3+1]=dy*sp; pvel[i*3+2]=dz*sp;
        const c = cs[i % 3];
        pcol[i*3]=c[0]; pcol[i*3+1]=c[1]; pcol[i*3+2]=c[2];
      }
      pgeo.attributes.position.needsUpdate = true;
      pgeo.attributes.color.needsUpdate = true;
    };

    wrap.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    const resize = () => {
      const w = wrap.clientWidth || 1, h = wrap.clientHeight || 1;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove);

    let raf, t0 = performance.now(), tAcc = 0, last = t0, running = true;
    const onVis = () => { running = !document.hidden; if(running){ last = performance.now(); loop(); } };
    document.addEventListener('visibilitychange', onVis);

    const loop = () => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      const dt = Math.min((now - last)/1000, 0.05); last = now;
      const m = propsRef.current.motion ?? 1;
      tAcc += dt * (0.55 + m * 0.85);
      uniforms.uTime.value = tAcc;
      uniforms.uAmp.value = 0.12 + m * 0.18;
      uniforms.uGlow.value = (propsRef.current.theme === 'light' ? 0.5 : 0.85) * (0.55 + m*0.4);

      cur.x += (target.x - cur.x) * 0.05;
      cur.y += (target.y - cur.y) * 0.05;
      uniforms.uMouse.value.set(cur.x, -cur.y);

      mesh.rotation.y += dt * (0.05 + m*0.12);
      mesh.rotation.x = cur.y * 0.35;
      mesh.rotation.z += dt * 0.01 * m;
      mesh.position.x = cur.x * 0.4;
      mesh.position.y = -cur.y * 0.3;
      shell.rotation.y -= dt * 0.04 * m;
      shell.rotation.x = cur.y * 0.15;
      shell.position.copy(mesh.position).multiplyScalar(0.6);

      renderer.render(scene, camera);
    };
    loop();

    stateRef.current = { uniforms, renderer };

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
      geo.dispose(); mat.dispose(); shell.geometry.dispose(); shell.material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      stateRef.current = null;
    };
  }, []);

  // live-update colors without rebuilding the scene
  React.useEffect(() => {
    const s = stateRef.current; if (!s) return;
    const [a,b,c] = colors || ['#7c5cff','#22d3ee','#ff4d9d'];
    s.uniforms.uA.value.set(...hexToRGB(a));
    s.uniforms.uB.value.set(...hexToRGB(b));
    s.uniforms.uC.value.set(...hexToRGB(c));
  }, [colors]);

  return React.createElement('div', { ref: wrapRef, id:'orb-canvas' });
}

export default Orb;
