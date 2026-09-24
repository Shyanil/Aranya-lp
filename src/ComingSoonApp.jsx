import React, { useEffect, useRef, useState } from 'react';
import { submitLead } from './submitLead';

const DEVELOPER_LOGO = '/uploads/indo-group-logo.webp';
const BRAND_LOGO = DEVELOPER_LOGO;

const Arrow = ({ down = false }) => (
  <svg aria-hidden="true" className={down ? 'icon icon--down' : 'icon'} viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DELIVERED_PROJECTS = [
  { name: 'Rang Homes Phase 1', loc: 'Dharapur, Guwahati' },
  { name: 'Rang Homes Phase 2', loc: 'Dharapur, Guwahati' },
  { name: 'Rang Homes Punjabi Bagh', loc: 'New Delhi' },
];

const DESIGN_TEAM = [
  { role: 'Principal Architect', firm: 'Confluence Consultancy Services, Delhi' },
  { role: 'Landscape', firm: 'S.P Consultants, Delhi' },
  { role: 'MEP', firm: 'AEPL, Delhi' },
  { role: 'Structural', firm: 'Swati Structure Solutions Pvt. Ltd, Delhi' },
  { role: 'Local Architect', firm: 'Banka & Associates, Guwahati' },
];

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    if (!lead.name.trim()) return setError('Please enter your full name.');
    if (lead.phone.replace(/\D/g, '').length < 10) return setError('Please enter a valid 10-digit mobile number.');
    if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email.trim())) return setError('Please enter a valid email address.');
    if (lead.pincode && lead.pincode.replace(/\D/g, '').length !== 6) return setError('Please enter a valid 6-digit pincode.');

    setError('');
    setLoading(true);
    try {
      await submitLead({ ...lead, ...utm }, 'coming_soon');
      setSubmitted(true);
      const params = new URLSearchParams(window.location.search);
      params.set('source', 'coming_soon');
      if (lead.name) params.set('name', lead.name.trim());
      window.location.href = `/thank-you?${params.toString()}`;
    } catch (error) {
      setError(error.message || 'Unable to send your enquiry. Please try again.');
      setLoading(false);
    }
    return undefined;
  };

  return (
    <main className="coming-soon">
      <style>{`
        :root { --forest:#1a2e1a; --forest-deep:#0a130a; --cream:#f5f0e8; --cream-deep:#ebe4d7; --gold:#c9a96e; --gold-deep:#a67c3b; --sage:#7a9e7e; --line:rgba(26,46,26,.14); }
        .coming-soon { min-height:100vh; overflow:hidden; background:var(--cream); color:var(--forest); font-family:'DM Sans',system-ui,sans-serif; font-weight:300; }
        .section-shell { width:min(1440px,calc(100% - clamp(40px,6vw,96px))); margin:0 auto; }
        @media (min-width:1800px) { .section-shell { width:min(1560px,calc(100% - 96px)); } }
        .icon { width:18px; height:18px; flex:0 0 auto; }
        .icon--down { transform:rotate(90deg); }
        .eyebrow { margin:0 0 16px; color:var(--gold-deep); font-size:10px; font-weight:600; letter-spacing:.3em; text-transform:uppercase; }
        .button { min-height:48px; padding:0 30px; display:inline-flex; align-items:center; justify-content:center; gap:14px; border:1px solid var(--gold); border-radius:0; background:var(--gold); color:var(--forest); cursor:pointer; font:500 10px/1 'DM Sans',sans-serif; letter-spacing:.15em; text-transform:uppercase; text-decoration:none; transition:background .3s,color .3s,transform .3s,border-color .3s; }
        .button:hover { background:#dfc28e; transform:translateY(-2px); color:var(--forest); }
        .button--outline { background:transparent; color:var(--cream); border-color:rgba(245,240,232,.55); }
        .button--outline:hover { background:var(--cream); color:var(--forest); border-color:var(--cream); }
        .button--dark { background:var(--forest); color:var(--cream); border-color:var(--forest); }
        .button--dark:hover { background:var(--gold-deep); color:#fdfbf7; border-color:var(--gold-deep); }

        .site-header { position:fixed; z-index:50; inset:0 0 auto; height:80px; padding:0; display:flex; align-items:center; justify-content:center; background:rgba(10,19,10,.34); border-bottom:1px solid rgba(201,169,110,.12); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); transition:height .35s,background .35s,border-color .35s; }
        .site-header.is-scrolled { height:70px; background:rgba(10,19,10,.96); border-color:rgba(201,169,110,.3); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px); }
        .header-inner { display:flex; align-items:center; justify-content:space-between; gap:24px; height:100%; }
        .brand { display:inline-flex; align-items:center; border:0; padding:0; background:transparent; cursor:pointer; }
        .brand img { width:auto; height:42px; display:block; object-fit:contain; }
        .header-actions { display:flex; align-items:center; gap:28px; }
        .header-link { border:0; padding:5px 0; background:transparent; color:rgba(245,240,232,.75); cursor:pointer; font:400 10px/1 'DM Sans',sans-serif; letter-spacing:.12em; text-transform:uppercase; transition:color .3s; }
        .header-link:hover { color:var(--gold); }
        .header-cta { min-height:38px; padding:0 21px; background:transparent; color:var(--gold); }
        .header-cta:hover { background:var(--gold); color:var(--forest); }

        /* Hero */
        .hero { position:relative; min-height:100svh; display:flex; align-items:center; justify-content:center; padding:120px 0 72px; overflow:hidden; color:var(--cream); }
        .hero-bg { position:absolute; inset:-5%; background:url('/uploads/coming-soon-hero.webp') center 40%/cover no-repeat; transform:scale(1.04); animation:heroDrift 16s ease-out both; }
        .hero-overlay { position:absolute; inset:0; background:linear-gradient(90deg,rgba(8,18,8,.88),rgba(8,18,8,.45) 58%,rgba(8,18,8,.56)),linear-gradient(to bottom,rgba(8,18,8,.35),rgba(8,18,8,.76)); }
        .hero-layout { position:relative; z-index:2; display:grid; grid-template-columns:minmax(0,1.15fr) minmax(380px,460px); gap:clamp(40px,5vw,84px); align-items:center; }
        .hero-content { opacity:0; transform:translateY(24px); transition:opacity 1.1s ease,transform 1.1s ease; }
        .hero-content.is-ready { opacity:1; transform:translateY(0); }
        .hero h1 { max-width:720px; margin:0 0 24px; font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(3.4rem,6vw,6.4rem); font-weight:300; line-height:1.01; letter-spacing:-.02em; }
        .hero h1 em { display:block; color:var(--gold); font-weight:300; }
        .hero-copy { max-width:530px; margin:0 0 20px; color:rgba(245,240,232,.72); font-size:14px; line-height:1.9; letter-spacing:.035em; }

        .hero-stats { display:flex; align-items:center; gap:clamp(14px,2.2vw,28px); width:fit-content; max-width:530px; padding-top:18px; border-top:1px solid rgba(201,169,110,.25); flex-wrap:wrap; }
        .hero-stat-card { display:flex; flex-direction:column; gap:4px; }
        .hero-stat-card--clickable { cursor:pointer; transition:transform .2s; }
        .hero-stat-card--clickable:hover { transform:translateY(-2px); }
        .hero-stat-card--clickable:hover .hero-stat-num { color:#dfc28e; }
        .hero-stat-num { font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(1.75rem,2.6vw,2.3rem); font-weight:300; line-height:1; color:var(--gold); }
        .hero-stat-label { font-size:9px; font-weight:500; letter-spacing:.14em; text-transform:uppercase; color:rgba(245,240,232,.65); }
        .hero-stat-divider { width:1px; height:32px; background:rgba(201,169,110,.25); }

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

        /* Location Section: Clean, Minimal & Atmospheric (Coming Soon) */
        .location-section { scroll-margin-top:70px; position:relative; padding:clamp(70px,8vw,110px) 0; background:#ffffff; color:var(--forest); border-bottom:1px solid var(--line); }
        .location-title-grid { display:grid; grid-template-columns:1.05fr .95fr; gap:clamp(24px,4vw,48px); align-items:end; margin-bottom:32px; }
        .location-title-grid h2 { margin:0; font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(2.6rem,4.4vw,4.2rem); font-weight:300; line-height:1.04; letter-spacing:-.02em; color:var(--forest); }
        .location-title-grid h2 em { color:var(--gold-deep); font-style:italic; font-weight:300; }
        .location-lead { margin:0; color:#445444; font-size:14.5px; line-height:1.85; font-weight:300; }

        /* Unified Compact Master Card: Project Coordinates + 4 Benchmarks */
        .location-hero-card { display:grid; grid-template-columns:1.08fr .92fr; background:#faf8f5; border:1px solid rgba(201,169,110,.35); margin:0 0 28px; box-shadow:0 4px 20px rgba(0,0,0,.025); }
        
        .coords-card { padding:clamp(24px,3vw,34px); border-right:1px solid rgba(201,169,110,.25); display:flex; flex-direction:column; justify-content:center; }
        .coords-card-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
        .coords-label { font-size:9.5px; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:var(--gold-deep); }
        .coords-pin { font-size:10.5px; font-weight:600; color:#7a8a7a; letter-spacing:.1em; }
        .coords-project-name { margin:0 0 10px; font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(22px,2.4vw,28px); font-weight:400; color:var(--forest); line-height:1.15; }
        .coords-address { margin:0; font-size:13px; color:#4a5a4a; line-height:1.7; }

        /* 4 Key Proximity Anchors */
        .anchors-grid { display:grid; grid-template-columns:1fr 1fr; }
        .anchor-tile { padding:clamp(18px,2.4vw,26px) clamp(16px,2vw,22px); border-right:1px solid rgba(201,169,110,.2); border-bottom:1px solid rgba(201,169,110,.2); display:flex; flex-direction:column; justify-content:center; transition:background .25s; }
        .anchor-tile:nth-child(2n) { border-right:0; }
        .anchor-tile:nth-child(n+3) { border-bottom:0; }
        .anchor-tile:hover { background:#ffffff; }
        .anchor-num { font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(2rem,3vw,2.8rem); font-weight:300; line-height:1; color:var(--gold-deep); margin-bottom:4px; }
        .anchor-name { font-size:10px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--forest); margin-bottom:2px; }
        .anchor-sub { font-size:11px; color:#7a8a7a; line-height:1.35; }

        /* Why This Area is Great: The Aerocity Advantage */
        .area-advantage-box { background:#faf8f5; border:1px solid rgba(26,46,26,.08); padding:clamp(22px,3vw,30px); }
        .area-advantage-head { margin-bottom:18px; padding-bottom:12px; border-bottom:1px solid rgba(26,46,26,.07); }
        .area-advantage-badge { font-size:9px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:var(--gold-deep); display:block; margin-bottom:4px; }
        .area-advantage-title { font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(20px,2.2vw,24px); font-weight:400; color:var(--forest); margin:0; }
        .advantage-pillars { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .advantage-card { display:flex; flex-direction:column; gap:6px; padding:14px 16px; background:#ffffff; border-left:2.5px solid var(--gold); }
        .advantage-tag { font-size:9px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--forest); }
        .advantage-bold { font-family:'Cormorant Garamond',Georgia,serif; font-size:16px; font-weight:600; color:var(--gold-deep); line-height:1.2; }
        .advantage-desc { font-size:11.5px; color:#556555; line-height:1.6; margin:0; }

        /* About the Developer Section */
        .developer-section { scroll-margin-top:70px; position:relative; padding:clamp(90px,11vw,144px) 0; background:var(--cream-deep); color:var(--forest); border-bottom:1px solid var(--line); }
        .developer-grid { display:grid; grid-template-columns:1.08fr .92fr; gap:clamp(40px,6vw,84px); align-items:start; }
        .dev-narrative h2 { margin:0 0 24px; font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(2.6rem,4.4vw,4.2rem); font-weight:300; color:var(--forest); line-height:1.08; letter-spacing:-.02em; }
        .dev-narrative h2 em { color:var(--gold-deep); font-weight:300; font-style:italic; }
        .dev-copy { margin:0 0 20px; font-size:14px; line-height:1.9; color:#4a5a4a; }
        .dev-stats-row { display:flex; gap:36px; margin:32px 0 36px; flex-wrap:wrap; }
        .dev-stat-item { display:flex; flex-direction:column; gap:6px; }
        .dev-stat-val { font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(2.5rem,3.8vw,3.2rem); font-weight:300; color:var(--forest); line-height:1; }
        .dev-stat-lbl { font-size:10px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--sage); }

        .dev-sidebar { display:flex; flex-direction:column; gap:32px; }
        .dev-projects-title { margin:0 0 16px; font-size:10px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:var(--sage); }
        .project-row { display:flex; align-items:center; justify-content:space-between; padding:16px 0; border-bottom:1px solid rgba(26,46,26,.1); }
        .project-row:first-child { padding-top:0; }
        .project-name { font-family:'Cormorant Garamond',Georgia,serif; font-size:21px; font-weight:400; color:var(--forest); }
        .project-loc { font-size:11px; color:#6b6b6b; margin-top:2px; }
        .delivered-tag { font-size:9px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:#3d6945; border:1px solid #7a9e7e; background:rgba(122,158,126,.12); padding:5px 12px; flex-shrink:0; }

        .design-team-box { padding:26px 28px; background:var(--forest); color:var(--cream); border:1px solid rgba(201,169,110,.25); box-shadow:0 12px 36px rgba(0,0,0,.1); }
        .design-team-head { margin:0 0 14px; font-size:9px; font-weight:600; letter-spacing:.22em; text-transform:uppercase; color:var(--gold); }
        .team-member-row { display:flex; justify-content:space-between; gap:16px; padding:8px 0; border-bottom:1px solid rgba(245,240,232,.08); }
        .team-member-row:last-child { border-bottom:0; }
        .team-member-role { font-size:11.5px; color:rgba(245,240,232,.55); }
        .team-member-firm { font-size:11.5px; color:rgba(245,240,232,.92); font-weight:400; text-align:right; }

        /* Footer */
        .footer { padding:32px 0; background:var(--cream); border-top:1px solid var(--line); }
        .footer-inner { display:grid; grid-template-columns:1fr auto 1fr; gap:24px; align-items:center; }
        .footer img { width:auto; height:32px; display:block; }
        .footer p,.footer button { margin:0; color:rgba(26,46,26,.52); font-size:8px; line-height:1.6; letter-spacing:.13em; text-transform:uppercase; }
        .footer button { justify-self:end; border:0; padding:5px 0; background:transparent; cursor:pointer; }

        @keyframes heroDrift { from { transform:scale(1.1); } to { transform:scale(1.04); } }

        @media (max-width:960px) {
          .hero { min-height:auto; padding:110px 0 70px; }
          .hero-layout { grid-template-columns:1fr; gap:40px; }
          .hero-content { max-width:100%; }
          .form-panel { width:min(100%,620px); margin:0 auto; }
          .location-title-grid { grid-template-columns:1fr; gap:20px; }
          .location-hero-card { grid-template-columns:1fr; }
          .coords-card { border-right:0; border-bottom:1px solid rgba(201,169,110,.25); }
          .advantage-pillars { grid-template-columns:repeat(2,1fr); }
          .developer-grid { grid-template-columns:1fr; gap:40px; }
        }

        @media (max-width:620px) {
          .section-shell { width:calc(100% - 36px); }
          .site-header { height:68px; padding:0; }
          .site-header.is-scrolled { height:62px; }
          .brand img { height:34px; }
          .header-link { display:none; }
          .header-cta { min-height:35px; padding:0 14px; font-size:8px; }
          .hero h1 { font-size:clamp(2.9rem,13vw,4.4rem); }
          .hero-copy { font-size:13px; margin-bottom:18px; }
          .hero-stats { width:100%; gap:14px; justify-content:space-between; }
          .hero-stat-divider { display:none; }
          .form-panel { width:100%; margin:0; padding:28px 18px; }
          .lead-form { grid-template-columns:1fr; }
          .field--wide,.form-error,.form-submit,.privacy { grid-column:auto; }
          .anchors-grid { grid-template-columns:1fr 1fr; }
          .anchor-tile { padding:14px 10px; }
          .anchor-num { font-size:1.8rem; }
          .advantage-pillars { grid-template-columns:1fr; }
          .team-member-row { flex-direction:column; gap:2px; }
          .team-member-firm { text-align:left; }
          .footer-inner { grid-template-columns:1fr auto; }
          .footer p { display:none; }
        }

        @media (prefers-reduced-motion:reduce) { *,*::before,*::after { scroll-behavior:auto!important; animation-duration:.01ms!important; animation-iteration-count:1!important; transition-duration:.01ms!important; } }
      `}</style>

      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <div className="section-shell header-inner">
          <button className="brand" onClick={() => scrollTo('hero')} aria-label="Go to top">
            <img src={BRAND_LOGO} alt="Indo Group" />
          </button>
          <div className="header-actions">
            <button className="header-link" onClick={() => scrollTo('location')}>Location</button>
            <button className="header-link" onClick={() => scrollTo('developer')}>Developer</button>
            <button className="button header-cta" onClick={() => scrollTo('hero-form', true)}>Register interest</button>
          </div>
        </div>
      </header>

      <section className="hero" id="hero" aria-labelledby="hero-title">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="section-shell hero-layout">
          <div className={`hero-content${ready ? ' is-ready' : ''}`}>
            <p className="eyebrow">An Indo Group presentation</p>
            <h1 id="hero-title">Something exceptional <em>is taking shape.</em></h1>
            <p className="hero-copy">A new residential experience is coming soon. Join the private registry to be among the first to know.</p>

            <div className="hero-stats">
              <div className="hero-stat-card hero-stat-card--clickable" onClick={() => scrollTo('location')} title="View Location Details">
                <span className="hero-stat-num">Aerocity</span>
                <span className="hero-stat-label">Dharapur, Guwahati</span>
              </div>
              <div className="hero-stat-divider" aria-hidden="true" />
              <div className="hero-stat-card">
                <span className="hero-stat-num">70%</span>
                <span className="hero-stat-label">Green Open Space</span>
              </div>
              <div className="hero-stat-divider" aria-hidden="true" />
              <div className="hero-stat-card">
                <span className="hero-stat-num">16,000+</span>
                <span className="hero-stat-label">Sq Ft Clubhouse</span>
              </div>
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

      {/* Location Section / 02 */}
      <section className="location-section" id="location" aria-labelledby="location-title">
        <div className="section-shell">
          <p className="eyebrow">Location / 02</p>
          <div className="location-title-grid">
            <h2 id="location-title">At the heart of <em>everything that matters.</em></h2>
            <p className="location-lead">
              Located in Aerocity's rapidly developing residential belt on Dharapur- Palashbari Road, the perfect confluence of urban conveniences and an escape into nature.
            </p>
          </div>

          {/* Compact Master Card: Exact Project Coordinates + Key Metrics */}
          <div className="location-hero-card">
            {/* Left: Project Coordinates & Address */}
            <div className="coords-card">
              <div className="coords-card-top">
                <span className="coords-label">Project Coordinates</span>
                <span className="coords-pin">PIN 781017</span>
              </div>
              <h3 className="coords-project-name">ARANYA BY RANG HOMES PHASE 1</h3>
              <p className="coords-address">
                4JM6+R77, Azara, Dharapur-Palashbari Road, Aerocity, Guwahati, Assam 781017
              </p>
            </div>

            {/* Right: 4 Key Proximity Anchors */}
            <div className="anchors-grid">
              <div className="anchor-tile">
                <span className="anchor-num">4.7 KM</span>
                <span className="anchor-name">Airport</span>
                <span className="anchor-sub">LGBI Terminal · ~8 mins</span>
              </div>
              <div className="anchor-tile">
                <span className="anchor-num">2.2 km</span>
                <span className="anchor-name">Nearest School</span>
                <span className="anchor-sub">Dharapur H.S. · ~4 mins</span>
              </div>
              <div className="anchor-tile">
                <span className="anchor-num">950 m</span>
                <span className="anchor-name">PHC</span>
                <span className="anchor-sub">Garal Primary Health · ~2 mins</span>
              </div>
              <div className="anchor-tile">
                <span className="anchor-num">70%</span>
                <span className="anchor-name">Green Cover</span>
                <span className="anchor-sub">Nature Sanctuary Buffer</span>
              </div>
            </div>
          </div>

          {/* Show How Great The Area Is: The Aerocity Advantage */}
          <div className="area-advantage-box">
            <div className="area-advantage-head">
              <span className="area-advantage-badge">The Aerocity Advantage</span>
              <h3 className="area-advantage-title">Why this address stands above the rest in Guwahati.</h3>
            </div>
            <div className="advantage-pillars">
              <div className="advantage-card">
                <span className="advantage-tag">High Appreciation</span>
                <span className="advantage-bold">Airport Growth Corridor</span>
                <p className="advantage-desc">
                  Under 10 mins (4.7 km) to LGBI International Airport. The fastest-appreciating residential corridor in Guwahati with rapid infrastructure expansion.
                </p>
              </div>
              <div className="advantage-card">
                <span className="advantage-tag">Pure Living</span>
                <span className="advantage-bold">70% Green Sanctuary</span>
                <p className="advantage-desc">
                  Shielded from central Guwahati's traffic jams and noise pollution. Clean mountain-fresh air, open horizons, and quiet tree-lined environs.
                </p>
              </div>
              <div className="advantage-card">
                <span className="advantage-tag">Arterial Reach</span>
                <span className="advantage-bold">Seamless Connectivity</span>
                <p className="advantage-desc">
                  Direct 4-lane access to Dharapur, Jalukbari Flyover (10 km), NH-27, and premier institutions within minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About the Developer Section / 03 */}
      <section className="developer-section" id="developer" aria-labelledby="developer-title">
        <div className="section-shell">
          <div className="developer-grid">
            <div className="dev-narrative">
              <p className="eyebrow">About the Developer / 03</p>
              <h2 id="developer-title">Built on integrity.<br /><em>Delivered with precision.</em></h2>
              <p className="dev-copy">
                Indotech Infracon Private Limited — the force behind Aranya by Rang Homes Phase 1 - has shaped the residential landscape of Guwahati over the years, delivering 600+ homes that stand as long-term assets for their residents.
              </p>
              <p className="dev-copy">
                Every project reflects a quiet conviction: quality must be consistent, details deliberate, and every home must honour the trust placed in it.
              </p>

              <div className="dev-stats-row">
                <div className="dev-stat-item">
                  <div className="dev-stat-val">600+</div>
                  <div className="dev-stat-lbl">Homes Delivered</div>
                </div>
                <div className="dev-stat-item">
                  <div className="dev-stat-val">8+</div>
                  <div className="dev-stat-lbl">Years of Trust</div>
                </div>
              </div>

              <button className="button button--dark" onClick={() => scrollTo('hero-form', true)}>
                Speak to the Team <Arrow />
              </button>
            </div>

            <div className="dev-sidebar">
              <div>
                <p className="dev-projects-title">Delivered Projects</p>
                {DELIVERED_PROJECTS.map((p, i) => (
                  <div key={i} className="project-row">
                    <div>
                      <div className="project-name">{p.name}</div>
                      <div className="project-loc">{p.loc}</div>
                    </div>
                    <span className="delivered-tag">Delivered</span>
                  </div>
                ))}
              </div>

              <div className="design-team-box">
                <p className="design-team-head">Design Team</p>
                {DESIGN_TEAM.map((t, i) => (
                  <div key={i} className="team-member-row">
                    <span className="team-member-role">{t.role}</span>
                    <span className="team-member-firm">{t.firm}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="section-shell footer-inner">
          <img src={DEVELOPER_LOGO} alt="Indo Group" />
          <p>Conceptual visuals for representational purposes only · © {new Date().getFullYear()}</p>
          <button onClick={() => scrollTo('hero')}>Back to top ↑</button>
        </div>
      </footer>
    </main>
  );
}
