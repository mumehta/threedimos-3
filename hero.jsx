/* hero.jsx — Hero with 3 layout variants sharing one WebGL orb */

import React from 'react';
import Orb from './orb.jsx';
import Reef from './reef.jsx';

function HeroArrow(){
  return React.createElement('svg', { className:'btn-arrow', width:16, height:16, viewBox:'0 0 16 16', fill:'none' },
    React.createElement('path', { d:'M4 12L12 4M12 4H5M12 4V11', stroke:'currentColor', strokeWidth:1.7, strokeLinecap:'round', strokeLinejoin:'round' }));
}

function HeroContent({ variant }){
  const eyebrow = (
    <span className="eyebrow">Interactive Web Studio</span>
  );
  const availability = (
    <div className="hero-availability"><i className="dot-live"></i>Booking projects for Q3 2026</div>
  );
  const title = (
    <h1 className="hero-title">
      <span className="l" style={{color:'var(--a1)'}}>Design.</span>
      <span className="l">Code.</span>
      <span className="l" style={{color:'var(--a3)'}}>Motion.</span>
    </h1>
  );
  const sub = (
    <p className="hero-sub">Websites and launch pages crafted to earn trust in seconds and turn visits into real enquiries.</p>
  );
  const cta = (
    <div className="hero-cta">
      <a className="btn btn-primary" href="#contact">Start a project <HeroArrow/></a>
      <a className="btn btn-ghost" href="#work">See our work</a>
    </div>
  );
  const meta = (
    <div className="hero-meta">
      <span><b>Fast builds.</b> Crafted interaction.</span>
      <span>Websites, launch pages, identity systems</span>
    </div>
  );

  if (variant === 'kinetic'){
    return (
      <div className="hero-content kinetic-only">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'24px'}}>
          {eyebrow}
          <div className="hero-availability"><i className="dot-live"></i>Booking projects for Q3 2026</div>
        </div>
        <div className="kinetic-marquee">
          <div className="kinetic-track">
            <span className="f">Design.</span><span className="o">Code.</span><span className="f">Motion.</span>
            <span className="f">Design.</span><span className="o">Code.</span><span className="f">Motion.</span>
          </div>
        </div>
        <div className="kinetic-row">
          {sub}
          {cta}
        </div>
      </div>
    );
  }

  return (
    <div className="hero-content standard">
      {availability}
      {title}
      {sub}
      {cta}
      {meta}
    </div>
  );
}

function Hero({ colors, motion, theme, variant, scene }){
  const Scene = scene === 'orb' ? Orb : Reef;
  return (
    <section className="hero" data-variant={variant} data-screen-label="Hero">
      <Scene colors={colors} motion={motion} theme={theme} />
      <div className="hero-inner">
        <HeroContent variant={variant} />
      </div>
      {scene !== 'orb' && <div className="hero-hint" aria-hidden="true">Ultra-real reef video background · procedural fallback if unavailable</div>}
      <div className="scroll-hint">
        <span>Scroll</span>
        <span className="bar"></span>
      </div>
    </section>
  );
}

export default Hero;
