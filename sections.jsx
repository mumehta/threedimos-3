/* sections.jsx — Nav, Trust, Services, Pillars, Work, Process, CTA, Footer */

import React from 'react';

/* ---------- tiny geometric icons ---------- */
const Ico = {
  web: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M3 9h18" stroke="currentColor" strokeWidth="1.6"/><circle cx="6" cy="6.5" r="0.7" fill="currentColor"/><circle cx="8.4" cy="6.5" r="0.7" fill="currentColor"/></svg>),
  bolt: (p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M13 3L5 13h6l-1 8 8-11h-6l1-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>),
  brush:(p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M4 20c2.5 0 4-1.5 4-4 0-1.1-.9-2-2-2s-2 .9-2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M8.5 14.5L18 5a2.1 2.1 0 013 3l-9.5 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>),
  shield:(p)=>(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>),
};

/* ---------- NAV ---------- */
function Logo(){
  const g = React.useRef(null);
  const onMove = (e)=>{
    const el = g.current; if(!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    el.style.transform = `rotate(${mx*9}deg) translate(${mx*1.6}px, ${my*1.6}px)`;
  };
  const onLeave = ()=>{ if(g.current) g.current.style.transform = ''; };
  return (
    <a className="brand" href="#top" aria-label="threedimos — home" onMouseMove={onMove} onMouseLeave={onLeave}>
      <span className="td-cube">
        <svg className="td-cube-svg" viewBox="0 0 100 100" aria-hidden="true">
          <g className="td-cube-g" ref={g}>
            <polygon className="cf-left"  points="15,35 50,55 50,95 15,75"></polygon>
            <polygon className="cf-right" points="85,35 50,55 50,95 85,75"></polygon>
            <polygon className="cf-top"   points="50,15 85,35 50,55 15,35"></polygon>
          </g>
        </svg>
      </span>
      <span className="td-word"><span className="td-three">three</span><span className="td-dimos">dimos</span></span>
    </a>
  );
}

const NAV_LINKS = [
  { href:'#services', label:'Services' },
  { href:'#work',     label:'Work' },
  { href:'#pillars',  label:'Approach' },
  { href:'#process',  label:'Process' },
];

function BurgerIcon(){ return (<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>); }
function CloseIcon(){  return (<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>); }

function Nav(){
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(()=>{
    const on = ()=> setScrolled(window.scrollY > 24);
    on(); window.addEventListener('scroll', on, {passive:true});
    return ()=> window.removeEventListener('scroll', on);
  },[]);

  React.useEffect(()=>{
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return ()=>{ document.body.style.overflow = ''; };
  },[menuOpen]);

  const close = ()=> setMenuOpen(false);

  return (
    <React.Fragment>
      <nav className={['nav', scrolled && 'scrolled', menuOpen && 'menu-open'].filter(Boolean).join(' ')}>
        <Logo/>
        <div className="nav-links">
          {NAV_LINKS.map(l => <a key={l.href} className="nav-link" href={l.href}>{l.label}</a>)}
          <a className="btn btn-primary nav-cta" href="#contact" style={{height:'40px',padding:'0 18px',fontSize:'14px'}}>Start a project</a>
        </div>
        <button className="nav-burger" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={()=> setMenuOpen(o=>!o)}>
          {menuOpen ? <CloseIcon/> : <BurgerIcon/>}
        </button>
      </nav>
      {menuOpen && (
        <div className="mobile-menu" role="navigation" aria-label="Mobile navigation">
          <nav className="mobile-nav-links">
            {NAV_LINKS.map(l => <a key={l.href} className="mobile-nav-link" href={l.href} onClick={close}>{l.label}</a>)}
          </nav>
          <a className="btn btn-primary mobile-cta" href="#contact" onClick={close}>Start a project</a>
        </div>
      )}
    </React.Fragment>
  );
}

/* ---------- TRUST ---------- */
function Trust(){
  const logos = ['Northwind','Maven & Co','Atlas Health','Brightleaf','Forma','Cedar Studio'];
  return (
    <section className="trust">
      <div className="wrap trust-inner">
        <div className="trust-label">Trusted by teams who sweat the details</div>
        <div className="trust-logos">
          {logos.map(l => <div className="logo-ph" key={l}>{l}</div>)}
        </div>
      </div>
    </section>
  );
}

/* ---------- SERVICES ---------- */
const SERVICES = [
  { n:'01', icon:'web',  title:'Interactive Business Websites', tagline:'Sites that work as hard as you do.',
    desc:'Multi-page websites with motion, a CMS you can actually use, and the polish that earns trust on first click.',
    tags:['WordPress','Hugo','Custom build'] },
  { n:'02', icon:'bolt', title:'Premium Landing Pages', tagline:'One page. Built to convert.',
    desc:'High-craft 2D / 3D landing pages engineered around a single goal: turning visitors into enquiries.',
    tags:['2D / 3D','Conversion-first','A/B ready'] },
  { n:'03', icon:'brush',title:'Brand & Visual Design', tagline:'Look the part, everywhere.',
    desc:'Web design, branding, guidelines, art direction and corporate identity, a system that scales with you.',
    tags:['Identity','Guidelines','Art direction'] },
  { n:'04', icon:'shield',title:'Maintenance & Support', tagline:'Stay fast, fresh, secure.',
    desc:'Ongoing updates, performance tuning and care plans so your site keeps earning long after launch.',
    tags:['Updates','Performance','Care plans'] },
];
function ServiceCard({ s, i }){
  const onMove = (e)=>{ const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%'); };
  const I = Ico[s.icon];
  return (
    <article className="svc-card" data-reveal style={{'--d': (i*0.07)+'s'}} onMouseMove={onMove}>
      <div className="svc-head-row">
        <div className="svc-ico"><I/></div>
        <h3>{s.title}</h3>
      </div>
      <div className="svc-tagline">{s.tagline}</div>
      <p className="svc-desc">{s.desc}</p>
      <div className="svc-tags">{s.tags.map(t=> <span className="tag" key={t}>{t}</span>)}</div>
    </article>
  );
}
function Services(){
  return (
    <section className="services section-pad" id="services" data-screen-label="Services">
      <div className="wrap">
        <div className="sec-head split reveal-block" data-reveal>
          <div>
            <h2 className="sec-title">Four ways we make<br/>businesses look premium.</h2>
          </div>
          <p className="sec-lead">From a single landing page to a full interactive site and the brand around it, scoped and built for small businesses that want to punch above their weight.</p>
        </div>
        <div className="svc-grid">
          {SERVICES.map((s,i)=> <ServiceCard s={s} i={i} key={s.n}/>)}
        </div>
      </div>
    </section>
  );
}

/* ---------- PILLARS ---------- */
const PILLARS = [
  { n:'01', t:'Design', d:'Interfaces and identity with intent: clear hierarchy, real craft, and the kind of detail people feel before they can name it.' },
  { n:'02', t:'Code', d:'Hand-built, fast and accessible front-ends. No bloated templates, just clean engineering that loads quick and ranks well.' },
  { n:'03', t:'Motion', d:'Animation that guides, never distracts. Scroll, hover and 3D moments that make a site feel alive and premium.' },
];
function Pillars(){
  return (
    <section className="pillars section-pad" id="pillars" data-screen-label="Approach">
      <div className="wrap">
        <div className="sec-head" data-reveal>
          <h2 className="sec-title">Three disciplines.<br/><span style={{color:'var(--a1)'}}>One studio.</span></h2>
          <p className="sec-lead">Most agencies hand you off between a designer, a developer and an animator. We do all three under one roof, so nothing gets lost in translation.</p>
        </div>
        <div className="pillar-grid" data-reveal>
          {PILLARS.map(p=>(
            <div className="pillar" key={p.n}>
              <div className="barfill"></div>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- WORK ---------- */
const WORK = [
  { note:'Launch concept built for pre-orders', title:'Aurora — 3D product launch', ph:'Aurora project preview', big:true },
  { note:'Client rebuild with cleaner booking flow', title:'Cedar Dental', ph:'Cedar Dental case preview' },
  { note:'Internal R&D for expressive typography', title:'Kinetic type system', ph:'Kinetic type system preview' },
];
function WorkArrow(){ return (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function HeroArrow(){ return (<svg className="btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function Work(){
  return (
    <section className="work section-pad" id="work" data-screen-label="Work">
      <div className="wrap">
        <div className="sec-head split" data-reveal>
          <div>
            <h2 className="sec-title">A taste of what<br/>we build.</h2>
          </div>
          <a className="btn btn-ghost" href="#contact">View all projects <WorkArrow/></a>
        </div>
        <div className="work-grid" data-reveal>
          {WORK.map((w,i)=>(
            <article className={w.big ? 'work-card big' : 'work-card'} key={i}>
              <div className="work-thumb" data-ph={w.ph}></div>
              <div className="work-meta">
                <div>
                  <h3>{w.title}</h3>
                  <p className="work-note">{w.note}</p>
                </div>
                <div className="work-arrow"><WorkArrow/></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- PROCESS ---------- */
const STEPS = [
  { n:'01', t:'Discovery', d:'We learn your business, goals and audience, then scope the smallest thing that moves the needle.' },
  { n:'02', t:'Design', d:'Direction, layouts and a clickable design you can react to. No surprises at the end.' },
  { n:'03', t:'Build', d:'Clean, fast, animated front-end. Built responsive and accessible from the first line.' },
  { n:'04', t:'Launch & care', d:'We ship, measure and stick around, keeping the site fast, fresh and converting.' },
];
function Process(){
  return (
    <section className="process section-pad" id="process" data-screen-label="Process">
      <div className="wrap">
        <div className="sec-head" data-reveal>
          <h2 className="sec-title">A calm, four-step path<br/>to launch.</h2>
        </div>
        <div className="proc-grid" data-reveal>
          {STEPS.map(s=>(
            <div className="proc-step" key={s.n}>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA ---------- */
function CTA(){
  return (
    <section className="cta section-pad" id="contact" data-screen-label="Contact CTA">
      <div className="wrap">
        <div className="cta-card" data-reveal>
          <h2>Build something<br/>worth visiting.</h2>
          <p>Tell us about your business and what you need. We'll come back with a plan, a timeline and a fair price, usually within two working days.</p>
          <div className="cta-actions">
            <a className="btn btn-primary" href="mailto:hello@threedimos.studio?subject=Project%20enquiry" style={{'--bh':'58px'}}>Start a project <HeroArrow/></a>
            <a className="btn btn-ghost" href="mailto:hello@threedimos.studio?subject=Discovery%20call" style={{'--bh':'58px'}}>Book a discovery call</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
function Footer(){
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <span className="td-cube foot-cube">
              <svg className="td-cube-svg" viewBox="0 0 100 100" aria-hidden="true">
                <g className="td-cube-g">
                  <polygon className="cf-left"  points="15,35 50,55 50,95 15,75"></polygon>
                  <polygon className="cf-right" points="85,35 50,55 50,95 85,75"></polygon>
                  <polygon className="cf-top"   points="50,15 85,35 50,55 15,35"></polygon>
                </g>
              </svg>
            </span>
            <div className="foot-word"><span>Three</span><span>Dimos</span></div>
            <div className="foot-tag">One studio for design, code, and motion.</div>
          </div>
          <div className="foot-cols">
            <div className="foot-col">
              <h3>Services</h3>
              <a href="#services">Business websites</a>
              <a href="#services">Landing pages</a>
              <a href="#services">Brand & design</a>
              <a href="#services">Maintenance</a>
            </div>
            <div className="foot-col">
              <h3>Studio</h3>
              <a href="#work">Work</a>
              <a href="#pillars">Approach</a>
              <a href="#process">Process</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="foot-col">
              <h3>Connect</h3>
              <a href="mailto:hello@threedimos.studio">hello@threedimos.studio</a>
              <a href="#">Instagram</a>
              <a href="#">Dribbble</a>
              <a href="#">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Three Dimos. All rights reserved.</span>
          <span>Interactive websites & landing pages for small business.</span>
        </div>
      </div>
    </footer>
  );
}

export { Nav, Trust, Services, Pillars, Work, Process, CTA, Footer };
