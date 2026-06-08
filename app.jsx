/* app.jsx — root, tweak wiring, theming, scroll reveal */

import React from 'react';
import { createRoot } from 'react-dom/client';
import Hero from './hero.jsx';
import { Nav, Trust, Services, Pillars, Work, Process, CTA, Footer } from './sections.jsx';
import { useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakToggle, TweakRadio, TweakColor } from './tweaks-panel.jsx';

const FONT_PAIRS = {
  grotesk:   { label:'Grotesk',   display:'"Schibsted Grotesk"', body:'"Hanken Grotesk"', mono:'"Space Mono"' },
  editorial: { label:'Editorial', display:'"Bricolage Grotesque"', body:'"Space Grotesk"', mono:'"Space Mono"' },
  techno:    { label:'Techno',    display:'"Space Grotesk"', body:'"Space Grotesk"', mono:'"JetBrains Mono"' },
};

const PALETTES = {
  spectrum: ['#f05a28','#0ea5a4','#ffd166'],
  aurora:   ['#0f766e','#0ea5e9','#eab308'],
  sunset:   ['#c2410c','#f97316','#84cc16'],
  electric: ['#d97706','#0891b2','#22c55e'],
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#f05a28", "#0ea5a4", "#ffd166"],
  "fonts": "grotesk",
  "theme": "dark",
  "motion": 1,
  "heroVariant": "centered",
  "scene": "reef",
  "radius": 16
}/*EDITMODE-END*/;

function revealEl(e){
  e.style.opacity = '1';
  e.style.transform = 'none';
  const d = e.style.getPropertyValue('--d');
  e.style.transition = `opacity .9s${d ? ' ' + d : ''} cubic-bezier(.2,.8,.2,1), transform .9s${d ? ' ' + d : ''} cubic-bezier(.2,.8,.2,1)`;
  e.classList.add('in');
}
function useReveal(motion){
  React.useEffect(()=>{
    const els = Array.from(document.querySelectorAll('[data-reveal]'));
    if (motion === 0){ els.forEach(revealEl); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        revealEl(entry.target);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [motion]);
}

function App(){
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const fonts = FONT_PAIRS[t.fonts] || FONT_PAIRS.grotesk;
  const pal = Array.isArray(t.palette) && t.palette.length>=3 ? t.palette : PALETTES.spectrum;

  // apply theme + tokens to <html>
  React.useEffect(()=>{
    const r = document.documentElement;
    r.setAttribute('data-theme', t.theme || 'dark');
    r.setAttribute('data-motion', String(t.motion));
    r.style.setProperty('--a1', pal[0]);
    r.style.setProperty('--a2', pal[1]);
    r.style.setProperty('--a3', pal[2]);
    r.style.setProperty('--radius', (t.radius ?? 16) + 'px');
    r.style.setProperty('--motion', String(t.motion ?? 1));
    r.style.setProperty('--font-display', fonts.display + ', system-ui, sans-serif');
    r.style.setProperty('--font-body', fonts.body + ', system-ui, sans-serif');
    r.style.setProperty('--font-mono', fonts.mono + ', ui-monospace, monospace');
  }, [t.theme, t.motion, t.radius, pal[0], pal[1], pal[2], t.fonts]);

  // Load non-default font pairs on demand — keeps initial payload to 3 families
  React.useEffect(() => {
    const urls = {
      editorial: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Space+Grotesk:wght@400;500;600;700&display=swap',
      techno:    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap',
    };
    const url = urls[t.fonts];
    if (!url) return;
    const id = `font-extra-${t.fonts}`;
    if (document.getElementById(id)) return;
    const link = Object.assign(document.createElement('link'), { id, rel: 'stylesheet', href: url });
    document.head.appendChild(link);
  }, [t.fonts]);

  useReveal(t.motion);

  return (
    <React.Fragment>
      <Nav/>
      <main id="top">
        <Hero colors={pal} motion={t.motion} theme={t.theme} variant={t.heroVariant} scene={t.scene}/>
        <Trust/>
        <Services/>
        <Pillars/>
        <Work/>
        <Process/>
        <CTA/>
      </main>
      <Footer/>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Hero layout">
          <TweakRadio label="Scene" value={t.scene}
            options={[{value:'reef',label:'Reef'},{value:'orb',label:'Orb'}]}
            onChange={v=> setTweak('scene', v)} />
          <TweakRadio label="Variant" value={t.heroVariant}
            options={[{value:'centered',label:'Center'},{value:'split',label:'Split'},{value:'kinetic',label:'Kinetic'}]}
            onChange={v=> setTweak('heroVariant', v)} />
        </TweakSection>

        <TweakSection label="Color">
          <TweakColor label="Accent" value={pal}
            options={[PALETTES.spectrum, PALETTES.aurora, PALETTES.sunset, PALETTES.electric]}
            onChange={v=> setTweak('palette', v)} />
          <TweakToggle label="Light mode" value={t.theme==='light'}
            onChange={v=> setTweak('theme', v ? 'light':'dark')} />
        </TweakSection>

        <TweakSection label="Type">
          <TweakRadio label="Pairing" value={t.fonts}
            options={[{value:'grotesk',label:'Grotesk'},{value:'editorial',label:'Editorial'},{value:'techno',label:'Techno'}]}
            onChange={v=> setTweak('fonts', v)} />
        </TweakSection>

        <TweakSection label="Feel">
          <TweakSlider label="Motion intensity" value={t.motion} min={0} max={1.4} step={0.1}
            onChange={v=> setTweak('motion', v)} />
          <TweakSlider label="Corner roundness" value={t.radius} min={0} max={28} step={1} unit="px"
            onChange={v=> setTweak('radius', v)} />
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
}

createRoot(document.getElementById('root')).render(<App/>);
