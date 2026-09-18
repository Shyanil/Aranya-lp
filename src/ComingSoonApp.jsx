import React, { useEffect, useRef, useState } from 'react';

const DEVELOPER_LOGO = '/uploads/indo-group-logo-transparent.png';
const BRAND_LOGO = DEVELOPER_LOGO;

const Arrow = ({ down = false }) => (
  <svg aria-hidden="true" className={down ? 'icon icon--down' : 'icon'} viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ComingSoonApp() {
  const [scrolled, setScrolled] = useState(false);
  const [ready, setReady] = useState(false);
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
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_term: params.get('utm_term') || '',
      utm_content: params.get('utm_content') || '',
      source_url: window.location.href,
    });
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    const timer = window.setTimeout(() => setReady(true), 80);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(timer);
    };
  }, []);

  const scrollTo = (id, focus = false) => {
    if (typeof document === 'undefined') return;
    const target = document.getElementById(id);
    target?.scrollIntoView({ behavior: 'smooth', block: id === 'hero-form' ? 'center' : 'start' });
    if (focus) window.setTimeout(() => nameInputRef.current?.focus({ preventScroll: true }), 650);
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
    window.setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 650);
    return undefined;
  };

  return (
    <main className="coming-soon">
      <style>{`
        :root { --forest:#1a2e1a; --forest-deep:#0a130a; --cream:#f5f0e8; --cream-deep:#ebe4d7; --gold:#c9a96e; --sage:#7a9e7e; --line:rgba(26,46,26,.18); }
        .coming-soon { min-height:100vh; overflow:hidden; background:var(--cream); color:var(--forest); font-family:'DM Sans',system-ui,sans-serif; font-weight:300; }
        .section-shell { width:min(1140px,calc(100% - 40px)); margin:0 auto; }
        .icon { width:19px; height:19px; flex:0 0 auto; }
        .icon--down { transform:rotate(90deg); }
        .eyebrow { margin:0 0 20px; color:var(--gold); font-size:10px; font-weight:500; letter-spacing:.3em; text-transform:uppercase; }
        .button { min-height:48px; padding:0 30px; display:inline-flex; align-items:center; justify-content:center; gap:14px; border:1px solid var(--gold); border-radius:0; background:var(--gold); color:var(--forest); cursor:pointer; font:500 10px/1 'DM Sans',sans-serif; letter-spacing:.15em; text-transform:uppercase; transition:background .3s,color .3s,transform .3s; }
        .button:hover { background:#dfc28e; transform:translateY(-2px); }
        .button--outline { background:transparent; color:var(--cream); border-color:rgba(245,240,232,.55); }
        .button--outline:hover { background:var(--cream); color:var(--forest); border-color:var(--cream); }

        .site-header { position:fixed; z-index:50; inset:0 0 auto; height:80px; padding:0 clamp(20px,5vw,72px); display:flex; align-items:center; background:rgba(10,19,10,.34); border-bottom:1px solid rgba(201,169,110,.12); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); transition:height .35s,background .35s,border-color .35s; }
        .site-header.is-scrolled { height:70px; background:rgba(10,19,10,.96); border-color:rgba(201,169,110,.3); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px); }
        .header-inner { width:100%; max-width:1440px; margin:auto; display:flex; align-items:center; justify-content:space-between; gap:24px; }
        .brand { display:inline-flex; align-items:center; border:0; padding:0; background:transparent; cursor:pointer; }
        .brand img { width:auto; height:42px; display:block; object-fit:contain; }
        .header-actions { display:flex; align-items:center; gap:34px; }
        .header-link { border:0; padding:5px 0; background:transparent; color:rgba(245,240,232,.75); cursor:pointer; font:400 10px/1 'DM Sans',sans-serif; letter-spacing:.12em; text-transform:uppercase; transition:color .3s; }
        .header-link:hover { color:var(--gold); }
        .header-cta { min-height:38px; padding:0 21px; background:transparent; color:var(--gold); }
        .header-cta:hover { background:var(--gold); color:var(--forest); }

        .hero { position:relative; min-height:100svh; display:flex; align-items:center; justify-content:center; padding:120px 0 72px; overflow:hidden; color:var(--cream); }
        .hero-bg { position:absolute; inset:-5%; background:url('/uploads/shot_07_5kshot_07_5k.webp') center 40%/cover no-repeat; transform:scale(1.04); animation:heroDrift 16s ease-out both; }
        .hero-overlay { position:absolute; inset:0; background:linear-gradient(90deg,rgba(8,18,8,.88),rgba(8,18,8,.45) 58%,rgba(8,18,8,.56)),linear-gradient(to bottom,rgba(8,18,8,.35),rgba(8,18,8,.76)); }
        .hero-layout { position:relative; z-index:2; width:min(1240px,calc(100% - 40px)); display:grid; grid-template-columns:minmax(0,1fr) minmax(360px,450px); gap:clamp(48px,7vw,100px); align-items:center; }
        .hero-content { opacity:0; transform:translateY(24px); transition:opacity 1.1s ease,transform 1.1s ease; }
        .hero-content.is-ready { opacity:1; transform:translateY(0); }
        .hero h1 { max-width:720px; margin:0 0 26px; font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(3.5rem,6.3vw,6.6rem); font-weight:300; line-height:1.01; letter-spacing:-.02em; }
        .hero h1 em { display:block; color:var(--gold); font-weight:300; }
        .hero-copy { max-width:530px; margin:0 0 38px; color:rgba(245,240,232,.7); font-size:14px; line-height:1.9; letter-spacing:.035em; }
        .hero-actions { display:flex; justify-content:flex-start; gap:14px; flex-wrap:wrap; }

        .teaser { padding:clamp(90px,12vw,170px) 0; background:var(--cream); }
        .teaser-inner { max-width:900px; text-align:center; }
        .teaser h2,.overview h2 { margin:0; font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(2.8rem,5vw,5.1rem); font-weight:300; line-height:1.03; letter-spacing:-.025em; }
        .teaser h2 em,.overview h2 em { color:var(--gold); font-weight:300; }
        .gold-rule { width:160px; height:1px; margin:30px 0; background:linear-gradient(to right,var(--gold),transparent); }
        .teaser .gold-rule { margin:30px auto; }
        .teaser-copy { max-width:600px; margin:0 auto; color:#4a5a4a; font-size:14px; line-height:1.95; }
        .form-panel { min-height:0; padding:clamp(28px,3.4vw,42px); display:flex; flex-direction:column; justify-content:center; scroll-margin-top:90px; background:rgba(10,19,10,.86); color:var(--cream); border:1px solid rgba(201,169,110,.3); box-shadow:0 28px 70px rgba(0,0,0,.28); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px); }
        .form-panel h3 { margin:0 0 12px; font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(2rem,3vw,3rem); font-weight:300; line-height:1.1; }
        .form-intro { margin:0 0 24px; color:rgba(245,240,232,.58); font-size:12px; line-height:1.7; }
        .lead-form { display:grid; grid-template-columns:1fr 1fr; gap:17px 20px; }
        .field--wide,.form-error,.form-submit,.privacy { grid-column:1/-1; }
        .field label { display:block; margin:0 0 8px; color:rgba(245,240,232,.52); font-size:9px; font-weight:500; letter-spacing:.18em; text-transform:uppercase; }
        .field input { width:100%; height:42px; padding:0 1px; border:0; border-bottom:1px solid rgba(245,240,232,.26); border-radius:0; outline:none; background:transparent; color:var(--cream); font:300 14px/1 'DM Sans',sans-serif; transition:border-color .25s; }
        .field input:focus { border-color:var(--gold); }
        .field input::placeholder { color:rgba(245,240,232,.3); }
        .form-error { margin:-5px 0 0; color:#efb0a5; font-size:12px; }
        .form-submit { width:100%; margin-top:8px; }
        .form-submit:disabled { cursor:wait; opacity:.65; }
        .privacy { margin:0; color:rgba(245,240,232,.38); font-size:9px; line-height:1.6; text-align:center; letter-spacing:.04em; }
        .success { min-height:360px; display:flex; flex-direction:column; justify-content:center; }
        .success-mark { width:54px; height:54px; display:grid; place-items:center; margin-bottom:28px; border:1px solid var(--gold); border-radius:50%; color:var(--gold); font-size:20px; }
        .success p:last-child { max-width:440px; margin:8px 0 0; color:rgba(245,240,232,.6); font-size:14px; line-height:1.8; }

        .overview { scroll-margin-top:70px; position:relative; padding:clamp(84px,11vw,150px) 0; overflow:hidden; background:var(--forest-deep); color:var(--cream); }
        .overview::before { content:'Coming Soon'; position:absolute; right:-2vw; top:30px; color:rgba(201,169,110,.035); font-family:'Cormorant Garamond',Georgia,serif; font-size:min(20vw,250px); line-height:1; pointer-events:none; white-space:nowrap; }
        .overview-grid { position:relative; display:grid; grid-template-columns:1.03fr .97fr; gap:clamp(44px,8vw,112px); align-items:center; }
        .overview-image { position:relative; min-height:620px; overflow:hidden; }
        .overview-image img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
        .image-label { position:absolute; z-index:1; bottom:16px; left:16px; margin:0; padding:6px 12px; border:1px solid rgba(245,240,232,.2); background:rgba(10,19,10,.68); color:rgba(245,240,232,.78); font-size:8px; letter-spacing:.16em; text-transform:uppercase; }
        .overview-copy>p.overview-intro { max-width:520px; margin:28px 0 36px; color:rgba(245,240,232,.62); font-size:14px; line-height:1.95; }
        .overview-note { margin:0 0 40px; padding:22px 0; border-top:1px solid rgba(245,240,232,.16); border-bottom:1px solid rgba(245,240,232,.16); color:rgba(245,240,232,.48); font-size:10px; line-height:1.7; letter-spacing:.15em; text-transform:uppercase; }

        .footer { padding:26px clamp(20px,5vw,72px); background:var(--cream); border-top:1px solid var(--line); }
        .footer-inner { max-width:1140px; margin:auto; display:grid; grid-template-columns:1fr auto 1fr; gap:24px; align-items:center; }
        .footer img { width:auto; height:32px; display:block; }
        .footer p,.footer button { margin:0; color:rgba(26,46,26,.52); font-size:8px; line-height:1.6; letter-spacing:.13em; text-transform:uppercase; }
        .footer button { justify-self:end; border:0; padding:5px 0; background:transparent; cursor:pointer; }

        @keyframes heroDrift { from { transform:scale(1.1); } to { transform:scale(1.04); } }
        @keyframes scrollPulse { 0%,100% { opacity:.35; transform:scaleY(.75); transform-origin:top; } 50% { opacity:1; transform:scaleY(1); transform-origin:top; } }

        @media (max-width:900px) {
          .hero { min-height:auto; padding:120px 0 80px; }
          .hero-layout,.overview-grid { grid-template-columns:1fr; }
          .hero-content { max-width:720px; }
          .form-panel { width:min(100%,620px); }
          .overview-image { min-height:520px; order:2; }
          .overview-copy { order:1; }
        }

        @media (max-width:620px) {
          .section-shell { width:min(100% - 36px,1140px); }
          .site-header { height:68px; padding:0 18px; }
          .site-header.is-scrolled { height:62px; }
          .brand img { height:34px; }
          .header-link { display:none; }
          .header-cta { min-height:35px; padding:0 14px; font-size:8px; }
          .hero h1 { font-size:clamp(3.25rem,15vw,5rem); }
          .hero-copy { font-size:13px; }
          .hero-actions { flex-direction:column; align-items:stretch; width:min(100%,310px); margin:auto; }
          .form-panel { width:auto; margin:0 -2px; padding:34px 22px; }
          .lead-form { grid-template-columns:1fr; }
          .field--wide,.form-error,.form-submit,.privacy { grid-column:auto; }
          .overview-image { min-height:410px; }
          .footer-inner { grid-template-columns:1fr auto; }
          .footer p { display:none; }
        }

        @media (prefers-reduced-motion:reduce) { *,*::before,*::after { scroll-behavior:auto!important; animation-duration:.01ms!important; animation-iteration-count:1!important; transition-duration:.01ms!important; } }
      `}</style>

      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <div className="header-inner">
          <button className="brand" onClick={() => scrollTo('hero')} aria-label="Go to top">
            <img src={BRAND_LOGO} alt="Indo Group" />
          </button>
          <div className="header-actions">
            <button className="header-link" onClick={() => scrollTo('overview')}>Overview</button>
            <button className="button header-cta" onClick={() => scrollTo('hero-form', true)}>Register interest</button>
          </div>
        </div>
      </header>

      <section className="hero" id="hero" aria-labelledby="hero-title">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-layout">
          <div className={`hero-content${ready ? ' is-ready' : ''}`}>
            <p className="eyebrow">An Indo Group presentation</p>
            <h1 id="hero-title">Something exceptional <em>is taking shape.</em></h1>
            <p className="hero-copy">A new residential experience is coming soon. Join the private registry to be among the first to know.</p>
            <div className="hero-actions">
              <button className="button button--outline" onClick={() => scrollTo('overview')}>A quiet first look <Arrow down /></button>
            </div>
          </div>

          <div className="form-panel" id="hero-form" aria-label="Early access registration">
            {submitted ? (
              <div className="success" role="status">
                <span className="success-mark">✓</span>
                <p className="eyebrow">You are on the list</p>
                <h3>Thank you, {lead.name.split(' ')[0]}.</h3>
                <p>We have received your details. Our team will be in touch when the private preview opens.</p>
              </div>
            ) : (
              <>
                <p className="eyebrow">Private registry</p>
                <h3>Be first to know.</h3>
                <p className="form-intro">Register for selected updates and early access.</p>
                <form className="lead-form" onSubmit={handleSubmit} noValidate>
                  {Object.entries(utm).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} readOnly />)}
                  <div className="field field--wide"><label htmlFor="lead-name">Full name *</label><input ref={nameInputRef} id="lead-name" name="name" autoComplete="name" value={lead.name} onChange={updateLead('name')} placeholder="Your name" required /></div>
                  <div className="field"><label htmlFor="lead-phone">Mobile number *</label><input id="lead-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={lead.phone} onChange={updateLead('phone')} placeholder="+91 98765 43210" required /></div>
                  <div className="field"><label htmlFor="lead-email">Email address</label><input id="lead-email" name="email" type="email" autoComplete="email" value={lead.email} onChange={updateLead('email')} placeholder="you@email.com" /></div>
                  <div className="field field--wide"><label htmlFor="lead-pincode">Pincode</label><input id="lead-pincode" name="pincode" inputMode="numeric" maxLength={6} autoComplete="postal-code" value={lead.pincode} onChange={updateLead('pincode')} placeholder="Your area pincode" /></div>
                  {error && <p className="form-error" role="alert">{error}</p>}
                  <button className="button form-submit" type="submit" disabled={loading}>{loading ? 'Saving your place…' : <>Request early access <Arrow /></>}</button>
                  <p className="privacy">Your details remain private and are used only for relevant updates.</p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="teaser" aria-labelledby="teaser-title">
        <div className="section-shell teaser-inner">
            <p className="eyebrow">Coming soon / 02</p>
            <h2 id="teaser-title">The best things are revealed <em>at the right moment.</em></h2>
            <div className="gold-rule" aria-hidden="true" />
            <p className="teaser-copy">This first look is intentionally brief. More will be shared privately with registered guests as the official reveal approaches.</p>
        </div>
      </section>

      <section className="overview" id="overview" aria-labelledby="overview-title">
        <div className="section-shell overview-grid">
          <figure className="overview-image">
            <img src="/uploads/entrance%20cam_rang%20homes.webp" alt="A nature-led residential arrival envisioned at dusk" loading="lazy" />
            <figcaption className="image-label">Artist's impression</figcaption>
          </figure>
          <div className="overview-copy">
            <p className="eyebrow">A quiet glimpse / 03</p>
            <h2 id="overview-title">A different way to feel <em>at home.</em></h2>
            <p className="overview-intro">Thoughtful, calm and connected to nature. For now, that is all we are ready to share.</p>
            <p className="overview-note">The complete story remains private until the official reveal.</p>
            <button className="button" onClick={() => scrollTo('hero-form', true)}>Join the private registry <Arrow /></button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <img src={DEVELOPER_LOGO} alt="Indo Group" />
          <p>Conceptual visuals for representational purposes only · © {new Date().getFullYear()}</p>
          <button onClick={() => scrollTo('hero')}>Back to top ↑</button>
        </div>
      </footer>
    </main>
  );
}
