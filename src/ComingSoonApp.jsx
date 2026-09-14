import React, { useEffect, useRef, useState } from 'react';

const LOGO_HEADER = '/uploads/indo-group-logo.png';
const LOGO_DARK = '/uploads/indo-group-logo-transparent.png';

const Arrow = ({ down = false }) => (
  <svg aria-hidden="true" className={down ? 'icon icon--down' : 'icon'} viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ComingSoonApp() {
  const [scrolled, setScrolled] = useState(false);
  const [lead, setLead] = useState({ name: '', email: '', phone: '', pincode: '' });
  const [utm, setUtm] = useState({ utm_source: '', utm_medium: '', utm_campaign: '', utm_term: '', utm_content: '', source_url: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const params = new URLSearchParams(window.location.search);
    setUtm({
      utm_source: params.get('utm_source') || '', utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '', utm_term: params.get('utm_term') || '',
      utm_content: params.get('utm_content') || '', source_url: window.location.href,
    });
    const onScroll = () => setScrolled(window.scrollY > 28);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id, focus = false) => {
    if (typeof document === 'undefined') return;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (focus) window.setTimeout(() => nameInputRef.current?.focus(), 650);
  };

  const updateLead = (field) => (event) => {
    setLead((current) => ({ ...current, [field]: event.target.value }));
    if (error) setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!lead.name.trim()) return setError('Please enter your full name.');
    if (lead.phone.replace(/\D/g, '').length < 10) return setError('Please enter a valid 10-digit mobile number.');
    if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email.trim())) return setError('Please enter a valid email address.');
    if (lead.pincode && lead.pincode.replace(/\D/g, '').length !== 6) return setError('Please enter a valid 6-digit pincode.');

    setError('');
    setLoading(true);
    const payload = { ...lead, ...utm, submitted_at: new Date().toISOString() };
    try {
      const saved = JSON.parse(window.localStorage.getItem('prelaunch_access_leads') || '[]');
      window.localStorage.setItem('prelaunch_access_leads', JSON.stringify([...saved, payload]));
    } catch (storageError) {
      console.warn('Unable to save lead locally:', storageError);
    }
    window.setTimeout(() => { setLoading(false); setSubmitted(true); }, 650);
    return undefined;
  };

  return (
    <main className="coming-soon">
      <style>{`
        :root { --ink:#10241b; --ink-deep:#091711; --paper:#f1f0e7; --paper-soft:#f8f7f1; --lime:#c9a96e; --moss:#55715f; --line:rgba(16,36,27,.16); }
        .coming-soon { min-height:100vh; overflow:hidden; background:var(--paper); color:var(--ink); font-family:'DM Sans',system-ui,sans-serif; }

        .site-header { position:fixed; z-index:50; inset:0 0 auto; padding:20px clamp(20px,4vw,64px); transition:background .3s,border-color .3s,padding .3s; border-bottom:1px solid transparent; }
        .site-header.is-scrolled { padding-top:13px; padding-bottom:13px; background:rgba(9,23,17,.88); border-color:rgba(255,255,255,.1); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px); }
        .header-inner { max-width:1440px; margin:auto; display:flex; align-items:center; justify-content:space-between; gap:24px; }
        .brand { display:inline-flex; align-items:center; }
        .brand img { width:auto; height:clamp(32px,3vw,42px); display:block; }
        .header-actions { display:flex; align-items:center; gap:clamp(18px,3vw,42px); }
        .text-link { border:0; padding:0; background:transparent; color:rgba(255,255,255,.7); font:500 11px/1 'DM Sans',sans-serif; letter-spacing:.16em; text-transform:uppercase; cursor:pointer; }
        .text-link:hover { color:#fff; }
        .header-cta,.primary-cta { border:0; display:inline-flex; align-items:center; justify-content:center; gap:14px; cursor:pointer; font:600 11px/1 'DM Sans',sans-serif; letter-spacing:.12em; text-transform:uppercase; transition:transform .25s,background .25s; }
        .header-cta { min-height:43px; padding:0 22px; border-radius:0; background:#c9a96e; color:#1a2e1a; }
        .header-cta:hover,.primary-cta:hover { transform:translateY(-2px); background:#dfc28e; }
        .icon { width:21px; height:21px; flex:0 0 auto; }
        .icon--down { transform:rotate(90deg); }

        .hero { position:relative; min-height:100svh; display:grid; grid-template-columns:minmax(0,.82fr) minmax(500px,1.18fr); background:var(--ink-deep); color:#fff; }
        .hero-copy { position:relative; z-index:2; display:flex; flex-direction:column; justify-content:flex-end; padding:clamp(130px,17vh,190px) clamp(28px,5vw,76px) clamp(48px,8vh,88px); }
        .eyebrow { display:flex; align-items:center; gap:12px; margin:0 0 24px; color:rgba(255,255,255,.62); font-size:10px; font-weight:600; letter-spacing:.22em; text-transform:uppercase; }
        .eyebrow::before { content:''; width:34px; height:1px; background:var(--lime); }
        .hero h1 { max-width:680px; margin:0; font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(4.4rem,8.4vw,9rem); font-weight:300; line-height:.78; letter-spacing:-.055em; }
        .hero h1 span { display:block; margin-left:clamp(18px,5vw,82px); color:var(--lime); font-style:italic; }
        .hero-intro { display:grid; grid-template-columns:1fr auto; align-items:end; gap:30px; margin-top:clamp(44px,8vh,86px); padding-top:24px; border-top:1px solid rgba(255,255,255,.16); }
        .hero-intro p { max-width:420px; margin:0; color:rgba(255,255,255,.68); font-size:clamp(.9rem,1.1vw,1.05rem); line-height:1.7; }
        .round-button { width:56px; height:56px; padding:0; display:grid; place-items:center; border:1px solid rgba(255,255,255,.35); border-radius:50%; background:transparent; color:#fff; cursor:pointer; transition:background .25s,color .25s,transform .25s; }
        .round-button:hover { color:var(--ink); background:var(--lime); border-color:var(--lime); transform:translateY(3px); }
        .hero-visual { position:relative; min-height:100svh; overflow:hidden; }
        .hero-visual::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,rgba(9,23,17,.42),transparent 35%),linear-gradient(0deg,rgba(9,23,17,.35),transparent 45%); pointer-events:none; }
        .hero-visual img { width:100%; height:100%; object-fit:cover; object-position:52% center; display:block; transform:scale(1.015); }
        .hero-form-card { position:absolute; z-index:5; top:50%; right:clamp(24px,4vw,58px); width:min(410px,35vw); padding:clamp(26px,3vw,38px); color:#fff; background:rgba(7,22,15,.72); border:1px solid rgba(255,255,255,.2); border-radius:24px; box-shadow:0 30px 80px rgba(0,0,0,.32); backdrop-filter:blur(22px) saturate(1.15); -webkit-backdrop-filter:blur(22px) saturate(1.15); transform:translateY(-43%); }
        .hero-form-card::before { content:''; position:absolute; inset:0; z-index:-1; border-radius:inherit; background:linear-gradient(145deg,rgba(255,255,255,.1),transparent 45%); pointer-events:none; }
        .hero-form-card>.eyebrow { margin-bottom:15px; color:rgba(255,255,255,.68); }
        .hero-form-card h2 { margin:0 0 10px; font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(2rem,2.8vw,3rem); font-weight:400; line-height:1; }
        .hero-form-card .form-intro { margin:0 0 25px; color:rgba(255,255,255,.62); font-size:.82rem; line-height:1.6; }
        .hero-form-card .field label { color:rgba(255,255,255,.58); }
        .hero-form-card .field input { height:45px; color:#fff; border-color:rgba(255,255,255,.28); }
        .hero-form-card .field input:focus { border-color:var(--lime); }
        .hero-form-card .field input::placeholder { color:rgba(255,255,255,.38); }
        .hero-form-card .primary-cta { min-height:52px; margin-top:3px; border-radius:0; background:#c9a96e; color:#1a2e1a; }
        .hero-form-card .privacy { color:rgba(255,255,255,.48); }
        .hero-form-card .form-error { color:#ffd1c9; }

        .marquee { overflow:hidden; border-bottom:1px solid var(--line); background:var(--lime); color:var(--ink); white-space:nowrap; }
        .marquee-track { width:max-content; padding:15px 0; animation:marquee 28s linear infinite; }
        .marquee-track span { display:inline-flex; align-items:center; gap:42px; padding-right:42px; font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; }
        .marquee-track span::after { content:'✦'; font-size:9px; }
        @keyframes marquee { to { transform:translateX(-50%); } }

        .story { padding:clamp(86px,12vw,170px) clamp(20px,5vw,72px); background:var(--paper); }
        .story-inner { max-width:1380px; margin:auto; }
        .section-heading { display:grid; grid-template-columns:.72fr 1.28fr; gap:clamp(40px,7vw,110px); align-items:start; margin-bottom:clamp(56px,8vw,108px); }
        .section-kicker { margin:12px 0 0; color:var(--moss); font-size:10px; font-weight:600; letter-spacing:.21em; text-transform:uppercase; }
        .section-heading h2 { max-width:890px; margin:0; font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(3rem,6.3vw,6.8rem); font-weight:300; line-height:.93; letter-spacing:-.04em; }
        .story-grid { display:grid; grid-template-columns:1.26fr .74fr; gap:clamp(20px,3vw,40px); }
        .story-image { min-height:660px; margin:0; border-radius:28px; overflow:hidden; }
        .story-image img { width:100%; height:100%; display:block; object-fit:cover; }
        .story-stack { display:grid; grid-template-rows:auto 1fr; gap:clamp(20px,3vw,40px); }
        .story-note { padding:clamp(30px,4vw,54px); border-radius:28px; background:var(--ink); color:#fff; }
        .story-note .index { display:inline-grid; place-items:center; width:34px; height:34px; border:1px solid rgba(255,255,255,.24); border-radius:50%; color:var(--lime); font-size:10px; }
        .story-note h3 { max-width:450px; margin:60px 0 22px; font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(2rem,3.5vw,3.7rem); font-weight:300; line-height:1; }
        .story-note p { max-width:430px; margin:0; color:rgba(255,255,255,.62); font-size:.9rem; line-height:1.75; }
        .metrics { display:grid; grid-template-columns:repeat(3,1fr); border:1px solid var(--line); border-radius:28px; background:var(--paper-soft); overflow:hidden; }
        .metric { min-height:190px; padding:28px 24px; display:flex; flex-direction:column; justify-content:space-between; border-right:1px solid var(--line); }
        .metric:last-child { border-right:0; }
        .metric strong { font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(2.7rem,4vw,4.5rem); font-weight:300; line-height:1; }
        .metric span { max-width:110px; color:var(--moss); font-size:9px; font-weight:600; line-height:1.5; letter-spacing:.15em; text-transform:uppercase; }

        .lead-form { display:grid; grid-template-columns:1fr 1fr; gap:22px 18px; }
        .field--wide { grid-column:1/-1; }
        .field label { display:block; margin:0 0 9px; color:var(--moss); font-size:9px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; }
        .field input { width:100%; height:52px; padding:0 2px; border:0; border-bottom:1px solid rgba(16,36,27,.28); border-radius:0; outline:none; background:transparent; color:var(--ink); font:400 1rem/1 'DM Sans',sans-serif; transition:border-color .2s; }
        .field input:focus { border-color:var(--ink); }
        .field input::placeholder { color:rgba(16,36,27,.35); }
        .form-error { grid-column:1/-1; margin:-6px 0 0; color:#a34235; font-size:12px; }
        .primary-cta { grid-column:1/-1; min-height:58px; margin-top:8px; padding:0 28px; border-radius:0; background:#c9a96e; color:#1a2e1a; }
        .primary-cta:disabled { cursor:wait; opacity:.65; }
        .privacy { grid-column:1/-1; display:flex; align-items:center; justify-content:center; gap:8px; margin:0; color:rgba(16,36,27,.5); font-size:10px; line-height:1.5; text-align:center; }
        .success { min-height:390px; display:flex; flex-direction:column; align-items:flex-start; justify-content:center; }
        .success-mark { width:62px; height:62px; display:grid; place-items:center; margin-bottom:34px; border-radius:50%; background:var(--lime); color:var(--ink); font-size:24px; }
        .success h2 { margin-bottom:14px; }
        .success p:last-child { max-width:440px; margin:0; color:rgba(255,255,255,.62); line-height:1.7; }

        .closing { position:relative; min-height:760px; display:flex; align-items:flex-end; padding:clamp(70px,8vw,120px) clamp(24px,6vw,90px); overflow:hidden; color:#fff; background-image:linear-gradient(90deg,rgba(6,18,12,.88),rgba(6,18,12,.28) 62%,rgba(6,18,12,.18)),linear-gradient(0deg,rgba(6,18,12,.68),transparent 60%),url('/uploads/club%20cam_rang%20homes_rev.webp'); background-size:cover; background-position:center; }
        .closing-content { position:relative; z-index:1; width:min(100%,1380px); margin:0 auto; display:grid; grid-template-columns:1fr auto; gap:40px; align-items:end; }
        .closing h2 { max-width:820px; margin:0; font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(4rem,8vw,8rem); font-weight:300; line-height:.82; letter-spacing:-.05em; }
        .closing h2 em { display:block; color:var(--lime); font-weight:300; }
        .closing-action { padding-bottom:8px; text-align:right; }
        .closing-action p { max-width:320px; margin:0 0 22px; color:rgba(255,255,255,.7); font-size:.9rem; line-height:1.65; }
        .closing-action .header-cta { min-height:54px; padding:0 28px; }

        .footer { padding:28px clamp(20px,5vw,72px); background:var(--paper); border-top:1px solid var(--line); }
        .footer-inner { max-width:1380px; margin:auto; display:grid; grid-template-columns:1fr auto 1fr; gap:24px; align-items:center; }
        .footer img { width:auto; height:30px; }
        .footer p,.footer button { margin:0; color:rgba(16,36,27,.55); font-size:9px; line-height:1.5; letter-spacing:.12em; text-transform:uppercase; }
        .footer button { justify-self:end; border:0; background:transparent; cursor:pointer; }

        @media (max-width:1050px) {
          .hero { display:block; padding-bottom:54px; }
          .hero-copy { min-height:780px; padding-right:clamp(28px,8vw,82px); background:linear-gradient(90deg,rgba(9,23,17,.96),rgba(9,23,17,.8) 55%,rgba(9,23,17,.38)); }
          .hero-visual { position:absolute; inset:0; min-height:100%; }
          .hero-visual::after { background:linear-gradient(0deg,rgba(9,23,17,.65),transparent 50%); }
          .hero h1 { font-size:clamp(5rem,13vw,8.5rem); }
          .hero-form-card { position:relative; top:auto; right:auto; width:min(640px,calc(100% - 80px)); margin:-92px auto 0; transform:none; }
          .story-grid { grid-template-columns:1fr; }
          .story-image { min-height:540px; }
          .story-stack { grid-template-columns:1fr; grid-template-rows:auto auto; }
          .closing-content { grid-template-columns:1fr; }
          .closing-action { text-align:left; }
        }

        @media (max-width:700px) {
          .site-header { padding:15px 18px; }
          .text-link { display:none; }
          .header-cta { min-height:39px; padding:0 17px; font-size:9px; }
          .brand img { height:30px; }
          .hero { padding-bottom:28px; }
          .hero-copy { min-height:690px; padding:118px 20px 70px; background:linear-gradient(90deg,rgba(9,23,17,.9),rgba(9,23,17,.42)),linear-gradient(0deg,rgba(9,23,17,.8),transparent 55%); }
          .hero h1 { font-size:clamp(4.2rem,22vw,6.3rem); line-height:.82; }
          .hero h1 span { margin-left:10px; }
          .hero-intro { margin-top:auto; padding-top:20px; gap:20px; }
          .hero-intro p { font-size:.86rem; line-height:1.6; }
          .round-button { width:48px; height:48px; }
          .hero-form-card { width:calc(100% - 36px); margin:-42px auto 0; padding:26px 20px; border-radius:20px; }
          .hero-form-card h2 { font-size:2.45rem; }
          .story { padding:74px 18px; }
          .section-heading { grid-template-columns:1fr; gap:26px; margin-bottom:44px; }
          .section-heading h2 { font-size:clamp(3rem,15vw,4.6rem); }
          .story-image { min-height:420px; border-radius:20px; }
          .story-note { border-radius:20px; }
          .story-note h3 { margin-top:46px; }
          .metrics { grid-template-columns:1fr; border-radius:20px; }
          .metric { min-height:130px; border-right:0; border-bottom:1px solid var(--line); }
          .metric:last-child { border-bottom:0; }
          .lead-form { grid-template-columns:1fr; }
          .field--wide,.form-error,.primary-cta,.privacy { grid-column:auto; }
          .closing { min-height:650px; padding:70px 20px 52px; background-position:58% center; }
          .closing h2 { font-size:clamp(4rem,20vw,6rem); }
          .footer-inner { grid-template-columns:1fr auto; }
          .footer p { display:none; }
        }

        @media (prefers-reduced-motion:reduce) { *,*::before,*::after { scroll-behavior:auto!important; animation-duration:.01ms!important; animation-iteration-count:1!important; } }
      `}</style>

      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <div className="header-inner">
          <button className="brand" onClick={() => scrollTo('hero')} aria-label="Go to top" style={{ border: 0, padding: 0, background: 'transparent', cursor: 'pointer' }}>
            <img src={LOGO_HEADER} alt="Indo Group" />
          </button>
          <div className="header-actions">
            <button className="text-link" onClick={() => scrollTo('vision')}>The vision</button>
            <button className="header-cta" onClick={() => scrollTo('hero-form', true)}>Request access <Arrow /></button>
          </div>
        </div>
      </header>

      <section className="hero" id="hero">
        <div className="hero-copy">
          <p className="eyebrow">A new residential experience · Guwahati</p>
          <h1>Live a little <span>wilder.</span></h1>
          <div className="hero-intro">
            <p>Space to breathe. Nature at your doorstep. A considered new address is taking root.</p>
            <button className="round-button" onClick={() => scrollTo('vision')} aria-label="Discover the vision"><Arrow down /></button>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <img src="/uploads/cam-02_revised.webp" alt="" fetchPriority="high" />
        </div>
        <aside className="hero-form-card" id="hero-form" aria-label="Early access registration">
          {submitted ? (
            <div className="success" role="status">
              <span className="success-mark">✓</span>
              <p className="eyebrow">You are on the list</p>
              <h2>Thank you, {lead.name.split(' ')[0]}.</h2>
              <p>We have received your details. Our team will reach out when the private preview opens.</p>
            </div>
          ) : (
            <>
              <p className="eyebrow">Register your interest</p>
              <h2>Get closer to the reveal.</h2>
              <p className="form-intro">Leave your details for early updates and invitation-only previews.</p>
              <form className="lead-form" onSubmit={handleSubmit} noValidate>
                {Object.entries(utm).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} readOnly />)}
                <div className="field field--wide"><label htmlFor="lead-name">Full name *</label><input ref={nameInputRef} id="lead-name" name="name" autoComplete="name" value={lead.name} onChange={updateLead('name')} placeholder="Your name" required /></div>
                <div className="field"><label htmlFor="lead-phone">Mobile number *</label><input id="lead-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={lead.phone} onChange={updateLead('phone')} placeholder="+91 98765 43210" required /></div>
                <div className="field"><label htmlFor="lead-email">Email address</label><input id="lead-email" name="email" type="email" autoComplete="email" value={lead.email} onChange={updateLead('email')} placeholder="you@email.com" /></div>
                <div className="field field--wide"><label htmlFor="lead-pincode">Pincode</label><input id="lead-pincode" name="pincode" inputMode="numeric" maxLength={6} autoComplete="postal-code" value={lead.pincode} onChange={updateLead('pincode')} placeholder="Your area pincode" /></div>
                {error && <p className="form-error" role="alert">{error}</p>}
                <button className="primary-cta" type="submit" disabled={loading}>{loading ? 'Saving your place…' : <>Request early access <Arrow /></>}</button>
                <p className="privacy"><span aria-hidden="true">○</span> Your details stay private and are used only for project updates.</p>
              </form>
            </>
          )}
        </aside>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((group) => <React.Fragment key={group}><span>Nature-led living</span><span>Private pre-launch</span><span>A quieter address</span><span>Made for more space</span></React.Fragment>)}
        </div>
      </div>

      <section className="story" id="vision">
        <div className="story-inner">
          <div className="section-heading"><p className="section-kicker">The idea / 01</p><h2>Designed for life beyond four walls.</h2></div>
          <div className="story-grid">
            <figure className="story-image"><img src="/uploads/shot%2015_v2.webp" alt="Landscaped residential spaces at dusk" loading="lazy" /></figure>
            <div className="story-stack">
              <article className="story-note">
                <span className="index">02</span><h3>A home that gives something back.</h3>
                <p>More daylight, more green, and more room for the rituals that make every day feel grounded. Thoughtful architecture meets a landscape made to be lived in.</p>
              </article>
              <div className="metrics" aria-label="Project highlights">
                <div className="metric"><strong>70%</strong><span>Open green spaces</span></div>
                <div className="metric"><strong>16K+</strong><span>Sq. ft. clubhouse</span></div>
                <div className="metric"><strong>01</strong><span>Distinctive address</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="closing" id="closing">
        <div className="closing-content">
          <h2>The reveal is <em>closer than you think.</em></h2>
          <div className="closing-action">
            <p>Join the private registry and be among the first to experience what is taking shape.</p>
            <button className="header-cta" onClick={() => scrollTo('hero-form', true)}>Register your interest <Arrow /></button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner"><img src={LOGO_DARK} alt="Rang Homes by Indo Group" /><p>Conceptual visuals for representational purposes only · © {new Date().getFullYear()}</p><button onClick={() => scrollTo('hero')}>Back to top ↑</button></div>
      </footer>
    </main>
  );
}
