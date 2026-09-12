import React, { useState, useEffect, useRef } from 'react';

// ─── GOLD DIVIDER ─────────────────────────────────────────────────────────────
function GoldDivider({ style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, ...style }}>
      <div style={{ height: 1, flex: 1, background: 'linear-gradient(to right, transparent, #c9a96e)' }} />
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c9a96e', flexShrink: 0 }} />
      <div style={{ height: 1, flex: 1, background: 'linear-gradient(to left, transparent, #c9a96e)' }} />
    </div>
  );
}

// ─── SCROLL REVEAL HOOK ───────────────────────────────────────────────────────
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight) {
      setVis(false);
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      }, { threshold });
      obs.observe(el);
      return () => obs.disconnect();
    }
  }, [threshold]);

  return [ref, vis];
}

export default function ComingSoonApp() {
  const [lead, setLead] = useState({ name: '', phone: '', email: '', config: '3 BHK Celestial (1,379 sq ft)' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [heroRef, heroVis] = useReveal(0.05);
  const [proofRef, proofVis] = useReveal(0.08);
  const [formRef, formVis] = useReveal(0.08);

  const scrollToForm = () => {
    const el = document.getElementById('early-access');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!lead.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    const clean = lead.phone.replace(/\D/g, '');
    if (clean.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 500);
  };

  return (
    <div style={{
      background: '#fcfbfa',
      color: '#1a2e1a',
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>

      {/* ─── NAVIGATION (WHITE / CREAM FROSTED) ─── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 76, padding: '0 clamp(20px, 5vw, 64px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.94)', backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(201, 169, 110, 0.22)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
        transition: 'background 0.3s ease'
      }}>
        {/* Brand Logo */}
        <a href="#hero" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
          <img
            src="uploads/logo design.webp"
            alt="Aranya Logo"
            style={{ height: 42, width: 'auto', objectFit: 'contain' }}
          />
          <div>
            <span style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 22, letterSpacing: '0.18em', color: '#1a2e1a', fontWeight: 600, display: 'block', lineHeight: 1
            }}>
              ARANYA
            </span>
            <span style={{
              display: 'block', fontSize: 9.5, letterSpacing: '0.24em', color: '#a07d3b',
              textTransform: 'uppercase', marginTop: 3, fontWeight: 500
            }}>
              BY RANG HOMES
            </span>
          </div>
        </a>

        {/* Right Status Pill & CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 16px', borderRadius: 20,
            background: '#faf7f0',
            border: '1px solid rgba(201, 169, 110, 0.4)'
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
            <span style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8c6b2d', fontWeight: 600 }}>
              PRE-LAUNCH
            </span>
          </div>

          <button
            onClick={scrollToForm}
            style={{
              background: 'linear-gradient(135deg, #c9a96e 0%, #b89355 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '11px 24px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              borderRadius: 4,
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(184, 147, 85, 0.35)',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Early Access
          </button>
        </div>
      </nav>

      {/* ─── 1. HERO / COMING SOON (LUMINOUS WHITE & CREAM WITH VISUAL) ─── */}
      <section id="hero" style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '130px clamp(20px, 6vw, 80px) 80px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #fcfbfa 0%, #f7f3eb 50%, #f4eee4 100%)',
        overflow: 'hidden'
      }}>
        {/* Subtle Architectural Watermark Image with Cream/White Blend */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'url("uploads/cam-02_revised.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          opacity: 0.14,
          filter: 'saturate(1.2)'
        }} />

        {/* Delicate Radial Ambient Glow */}
        <div style={{
          position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 900, height: 900,
          background: 'radial-gradient(circle, rgba(201,169,110,0.12) 0%, rgba(252,251,250,0) 70%)',
          pointerEvents: 'none'
        }} />

        {/* Hero Content */}
        <div ref={heroRef} style={{
          position: 'relative', zIndex: 2, maxWidth: 940, margin: '0 auto',
          opacity: heroVis ? 1 : 0, transform: heroVis ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>

          {/* Micro Eyebrow Pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '7px 20px', borderRadius: 30,
            background: '#ffffff',
            border: '1px solid rgba(201, 169, 110, 0.4)',
            boxShadow: '0 4px 16px rgba(160, 125, 59, 0.1)',
            marginBottom: 26
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#c9a96e' }} />
            <span style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8c6b2d', fontWeight: 600 }}>
              COMING SOON • PRE-LAUNCH EXCLUSIVE
            </span>
          </div>

          {/* Main Title: ARANYA by Rang Homes */}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(48px, 7.8vw, 96px)',
            fontWeight: 300,
            lineHeight: 1.02,
            letterSpacing: '0.03em',
            color: '#1a2e1a',
            marginBottom: 16
          }}>
            ARANYA
            <span style={{
              display: 'block',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(14px, 2.2vw, 22px)',
              fontWeight: 400,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#a07d3b',
              marginTop: 10
            }}>
              BY RANG HOMES
            </span>
          </h1>

          <GoldDivider style={{ maxWidth: 240, margin: '0 auto 24px' }} />

          {/* Required Tagline: A different way to live in Guwahati */}
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(26px, 4vw, 44px)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#1a2e1a',
            lineHeight: 1.25,
            marginBottom: 12
          }}>
            "A different way to live in Guwahati."
          </p>

          {/* Required Subtitle: Premium nature-led living in Dharapur */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(13.5px, 1.8vw, 17px)',
            fontWeight: 400,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#4d634d',
            marginBottom: 38
          }}>
            Premium nature-led living in Dharapur
          </p>

          {/* Strong Visual CTAs */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={scrollToForm}
              style={{
                background: 'linear-gradient(135deg, #c9a96e 0%, #b89355 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '16px 38px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                borderRadius: 4,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(184, 147, 85, 0.4)',
                transition: 'transform 0.25s, box-shadow 0.25s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Get Early Access →
            </button>

            <a
              href="uploads/Aranya brochure.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#ffffff',
                color: '#1a2e1a',
                border: '1px solid rgba(201, 169, 110, 0.45)',
                padding: '16px 34px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                borderRadius: 4,
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.25s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#b89355';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.45)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Download Preview PDF
            </a>
          </div>

          {/* Quick Stats Pill Strip in Pure White & Cream */}
          <div style={{
            marginTop: 54,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'clamp(18px, 3.5vw, 44px)',
            flexWrap: 'wrap',
            padding: '22px clamp(20px, 4vw, 44px)',
            background: '#ffffff',
            borderRadius: 8,
            boxShadow: '0 12px 36px rgba(30, 45, 30, 0.06)',
            border: '1px solid rgba(201, 169, 110, 0.3)'
          }}>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 30, fontWeight: 500, color: '#a07d3b', lineHeight: 1 }}>257</div>
              <div style={{ fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5b705b', marginTop: 5, fontWeight: 500 }}>Residences</div>
            </div>
            <div style={{ width: 1, height: 30, background: 'rgba(201, 169, 110, 0.3)' }} />
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 30, fontWeight: 500, color: '#a07d3b', lineHeight: 1 }}>2 &amp; 3 BHK</div>
              <div style={{ fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5b705b', marginTop: 5, fontWeight: 500 }}>Sanctuary Units</div>
            </div>
            <div style={{ width: 1, height: 30, background: 'rgba(201, 169, 110, 0.3)' }} />
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 30, fontWeight: 500, color: '#a07d3b', lineHeight: 1 }}>70%</div>
              <div style={{ fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5b705b', marginTop: 5, fontWeight: 500 }}>Open Greens</div>
            </div>
            <div style={{ width: 1, height: 30, background: 'rgba(201, 169, 110, 0.3)' }} />
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 30, fontWeight: 500, color: '#a07d3b', lineHeight: 1 }}>2031</div>
              <div style={{ fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5b705b', marginTop: 5, fontWeight: 500 }}>Possession</div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 2. THREE PROOF POINTS (WARM CREAM CANVAS WITH CRISP WHITE CARDS) ─── */}
      <section id="proof-points" style={{
        padding: 'clamp(90px, 10vw, 140px) clamp(20px, 6vw, 96px)',
        background: '#f5f0e8',
        position: 'relative'
      }}>
        <div ref={proofRef} style={{
          maxWidth: 1240, margin: '0 auto',
          opacity: proofVis ? 1 : 0, transform: proofVis ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease'
        }}>

          {/* Section Heading */}
          <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 6vw, 76px)' }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11.5,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#8c6b2d',
              fontWeight: 600,
              marginBottom: 12
            }}>
              THE THREE PROOF BLOCKS
            </p>

            <h2 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(38px, 4.8vw, 64px)',
              fontWeight: 300,
              lineHeight: 1.12,
              color: '#1a2e1a',
              letterSpacing: '-0.01em'
            }}>
              Sanctuary By Design
            </h2>

            <GoldDivider style={{ maxWidth: 220, margin: '18px auto 14px' }} />

            <p style={{
              fontSize: 'clamp(14px, 1.8vw, 17px)',
              fontWeight: 300,
              color: '#4d634d',
              maxWidth: 640,
              margin: '0 auto',
              lineHeight: 1.7
            }}>
              Three definitive proof blocks engineered to bring peace, breathing room, and timeless luxury back to daily life in Guwahati.
            </p>
          </div>

          {/* Three Pure White Architectural Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(24px, 3vw, 36px)'
          }}>

            {/* BLOCK 1: GREEN — 70% green open space* */}
            <div style={{
              background: '#ffffff',
              borderRadius: 8,
              overflow: 'hidden',
              boxShadow: '0 16px 44px rgba(30, 45, 30, 0.07)',
              border: '1px solid rgba(201, 169, 110, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.35s ease, box-shadow 0.35s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 24px 56px rgba(30, 45, 30, 0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 16px 44px rgba(30, 45, 30, 0.07)';
            }}>
              <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
                <img
                  src="uploads/cam-02_revised.webp"
                  alt="70% Green Open Space at Aranya"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(16,32,16,0.55) 0%, transparent 50%)' }} />
                <div style={{
                  position: 'absolute', top: 16, left: 18,
                  background: '#ffffff',
                  padding: '6px 14px', borderRadius: 20,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(201,169,110,0.4)'
                }}>
                  <span style={{ fontSize: 10, letterSpacing: '0.2em', color: '#8c6b2d', textTransform: 'uppercase', fontWeight: 600 }}>
                    PROOF 01 • GREEN
                  </span>
                </div>
              </div>

              <div style={{ padding: '34px 30px 36px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(46px, 4vw, 56px)',
                  fontWeight: 300,
                  color: '#a07d3b',
                  lineHeight: 1,
                  marginBottom: 6
                }}>
                  70%
                </div>

                <h3 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 26,
                  fontWeight: 400,
                  color: '#1a2e1a',
                  marginBottom: 14
                }}>
                  Green Open Space*
                </h3>

                <p style={{ fontSize: 14, fontWeight: 300, color: '#3d523d', lineHeight: 1.85, marginBottom: 22, flex: 1 }}>
                  A vast natural landscape with native botanical canopies, aroma gardens, butterfly habitats, and quiet shaded groves. <strong>Zero vehicular movement at surface level</strong> ensures clean, safe, oxygen-rich environments for children and seniors.
                </p>

                <div style={{
                  borderTop: '1px solid rgba(201, 169, 110, 0.2)',
                  paddingTop: 16, fontSize: 11.5,
                  letterSpacing: '0.1em', color: '#2b5f2e',
                  fontWeight: 600, textTransform: 'uppercase'
                }}>
                  ✓ 0 Surface Traffic • Pure Air Canopies • Themed Gardens
                </div>
              </div>
            </div>

            {/* BLOCK 2: WELLNESS — Holistic wellness */}
            <div style={{
              background: '#ffffff',
              borderRadius: 8,
              overflow: 'hidden',
              boxShadow: '0 16px 44px rgba(30, 45, 30, 0.07)',
              border: '1px solid rgba(201, 169, 110, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.35s ease, box-shadow 0.35s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 24px 56px rgba(30, 45, 30, 0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 16px 44px rgba(30, 45, 30, 0.07)';
            }}>
              <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
                <img
                  src="uploads/pool cam.webp"
                  alt="Holistic Wellness at Aranya"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(16,32,16,0.55) 0%, transparent 50%)' }} />
                <div style={{
                  position: 'absolute', top: 16, left: 18,
                  background: '#ffffff',
                  padding: '6px 14px', borderRadius: 20,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(201,169,110,0.4)'
                }}>
                  <span style={{ fontSize: 10, letterSpacing: '0.2em', color: '#8c6b2d', textTransform: 'uppercase', fontWeight: 600 }}>
                    PROOF 02 • WELLNESS
                  </span>
                </div>
              </div>

              <div style={{ padding: '34px 30px 36px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(46px, 4vw, 56px)',
                  fontWeight: 300,
                  color: '#a07d3b',
                  lineHeight: 1,
                  marginBottom: 6
                }}>
                  Holistic
                </div>

                <h3 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 26,
                  fontWeight: 400,
                  color: '#1a2e1a',
                  marginBottom: 14
                }}>
                  Holistic Wellness
                </h3>

                <p style={{ fontSize: 14, fontWeight: 300, color: '#3d523d', lineHeight: 1.85, marginBottom: 22, flex: 1 }}>
                  Homes harmonized with circadian sunlight and valley winds. Morning yoga lawns, reflexology footpaths, sensory water bodies, and expansive private balconies created to decompress the mind and revitalize the body daily.
                </p>

                <div style={{
                  borderTop: '1px solid rgba(201, 169, 110, 0.2)',
                  paddingTop: 16, fontSize: 11.5,
                  letterSpacing: '0.1em', color: '#2b5f2e',
                  fontWeight: 600, textTransform: 'uppercase'
                }}>
                  ✓ Swimming Pool Oasis • Yoga Lawn • Sensory Water Deck
                </div>
              </div>
            </div>

            {/* BLOCK 3: CLUB — Club Aranya, 16,000+ sq. ft.* */}
            <div style={{
              background: '#ffffff',
              borderRadius: 8,
              overflow: 'hidden',
              boxShadow: '0 16px 44px rgba(30, 45, 30, 0.07)',
              border: '1px solid rgba(201, 169, 110, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.35s ease, box-shadow 0.35s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 24px 56px rgba(30, 45, 30, 0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 16px 44px rgba(30, 45, 30, 0.07)';
            }}>
              <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
                <img
                  src="uploads/club cam_rang homes_rev.webp"
                  alt="Club Aranya 16,000+ sq. ft."
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(16,32,16,0.55) 0%, transparent 50%)' }} />
                <div style={{
                  position: 'absolute', top: 16, left: 18,
                  background: '#ffffff',
                  padding: '6px 14px', borderRadius: 20,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(201,169,110,0.4)'
                }}>
                  <span style={{ fontSize: 10, letterSpacing: '0.2em', color: '#8c6b2d', textTransform: 'uppercase', fontWeight: 600 }}>
                    PROOF 03 • CLUB
                  </span>
                </div>
              </div>

              <div style={{ padding: '34px 30px 36px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(46px, 4vw, 56px)',
                  fontWeight: 300,
                  color: '#a07d3b',
                  lineHeight: 1,
                  marginBottom: 6
                }}>
                  16,000+
                </div>

                <h3 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 26,
                  fontWeight: 400,
                  color: '#1a2e1a',
                  marginBottom: 14
                }}>
                  Club Aranya, Sq. Ft.*
                </h3>

                <p style={{ fontSize: 14, fontWeight: 300, color: '#3d523d', lineHeight: 1.85, marginBottom: 22, flex: 1 }}>
                  The crown jewel of community living in Guwahati. A sprawling multi-level club with a semi-Olympic pool, high-tech fitness centre, squash and badminton court, gaming arcade, kids' creative studio, and elegant private banquet hall.
                </p>

                <div style={{
                  borderTop: '1px solid rgba(201, 169, 110, 0.2)',
                  paddingTop: 16, fontSize: 11.5,
                  letterSpacing: '0.1em', color: '#2b5f2e',
                  fontWeight: 600, textTransform: 'uppercase'
                }}>
                  ✓ Gymnasium • Banquet Hall • Squash &amp; Badminton • Rooftop
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 3. EARLY ACCESS / LEAD FORM (PURE WHITE ELEVATED SUITE ON WARM IVORY) ─── */}
      <section id="early-access" style={{
        padding: 'clamp(90px, 10vw, 140px) clamp(20px, 6vw, 96px)',
        background: 'linear-gradient(180deg, #f5f0e8 0%, #fcfbfa 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Soft Gold Radial Illumination */}
        <div style={{
          position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 800, height: 800,
          background: 'radial-gradient(circle, rgba(201,169,110,0.1) 0%, rgba(252,251,250,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div ref={formRef} style={{
          maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 2,
          opacity: formVis ? 1 : 0, transform: formVis ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease'
        }}>

          {/* Elevated Pure White Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: 12,
            padding: 'clamp(36px, 6vw, 56px) clamp(24px, 5vw, 48px)',
            boxShadow: '0 24px 70px rgba(30, 45, 30, 0.08)',
            border: '1px solid rgba(201, 169, 110, 0.35)'
          }}>

            {!submitted ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: 36 }}>
                  <div style={{
                    display: 'inline-block', padding: '6px 18px', borderRadius: 20,
                    background: '#faf7f0', border: '1px solid rgba(201, 169, 110, 0.4)',
                    marginBottom: 16
                  }}>
                    <span style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8c6b2d', fontWeight: 600 }}>
                      PRIORITY INVITATION
                    </span>
                  </div>

                  {/* Required Heading: Be First in Line */}
                  <h2 style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 'clamp(36px, 4.5vw, 52px)',
                    fontWeight: 300,
                    lineHeight: 1.12,
                    color: '#1a2e1a',
                    marginBottom: 16
                  }}>
                    Be First in Line
                  </h2>

                  {/* Required Description */}
                  <p style={{
                    fontSize: 'clamp(14px, 1.8vw, 16.5px)',
                    fontWeight: 300,
                    color: '#4d634d',
                    lineHeight: 1.75,
                    maxWidth: 580,
                    margin: '0 auto'
                  }}>
                    Register for Early Access to receive launch updates, configuration details and first access to project information before the wider launch communication.
                  </p>
                </div>

                {error && (
                  <div style={{
                    background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c',
                    padding: '12px 16px', borderRadius: 4, fontSize: 13.5, marginBottom: 20, textAlign: 'center'
                  }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1a2e1a', fontWeight: 600, marginBottom: 7 }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={lead.name}
                      onChange={(e) => setLead({ ...lead, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: '#faf8f5',
                        border: '1px solid rgba(26, 46, 26, 0.18)',
                        borderRadius: 4,
                        color: '#1a2e1a',
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 15,
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#b89355'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(26, 46, 26, 0.18)'; }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1a2e1a', fontWeight: 600, marginBottom: 7 }}>
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={lead.phone}
                        onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          background: '#faf8f5',
                          border: '1px solid rgba(26, 46, 26, 0.18)',
                          borderRadius: 4,
                          color: '#1a2e1a',
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 15,
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = '#b89355'; }}
                        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(26, 46, 26, 0.18)'; }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1a2e1a', fontWeight: 600, marginBottom: 7 }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="rahul@example.com"
                        value={lead.email}
                        onChange={(e) => setLead({ ...lead, email: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          background: '#faf8f5',
                          border: '1px solid rgba(26, 46, 26, 0.18)',
                          borderRadius: 4,
                          color: '#1a2e1a',
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 15,
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = '#b89355'; }}
                        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(26, 46, 26, 0.18)'; }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1a2e1a', fontWeight: 600, marginBottom: 7 }}>
                      Configuration of Interest
                    </label>
                    <select
                      value={lead.config}
                      onChange={(e) => setLead({ ...lead, config: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: '#faf8f5',
                        border: '1px solid rgba(26, 46, 26, 0.18)',
                        borderRadius: 4,
                        color: '#1a2e1a',
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 15,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="2 BHK Aura (924 sq ft)">2 BHK Aura (924 sq ft)</option>
                      <option value="3 BHK Celestial (1,379 sq ft)">3 BHK Celestial (1,379 sq ft)</option>
                      <option value="3 BHK + Private Terrace">3 BHK + Private Terrace</option>
                      <option value="4 BHK Signature Sanctuary">4 BHK Signature Sanctuary</option>
                      <option value="All Configurations">Open to All Configurations</option>
                    </select>
                  </div>

                  {/* Required CTA Button: Get Early Access */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      marginTop: 10,
                      background: 'linear-gradient(135deg, #c9a96e 0%, #b89355 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '17px 28px',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13.5,
                      fontWeight: 600,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      borderRadius: 4,
                      cursor: loading ? 'wait' : 'pointer',
                      boxShadow: '0 8px 24px rgba(184, 147, 85, 0.35)',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    {loading ? 'Confirming Priority...' : 'Get Early Access →'}
                  </button>

                  <div style={{
                    display: 'flex', justifyContent: 'center', gap: 18, marginTop: 12,
                    color: '#6e856e', fontSize: 11.5
                  }}>
                    <span>🔒 100% Confidential</span>
                    <span>•</span>
                    <span>Direct Developer Priority</span>
                    <span>•</span>
                    <span>Zero Spam</span>
                  </div>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 10px' }}>
                <div style={{
                  width: 68, height: 68, borderRadius: '50%',
                  background: '#faf7f0', border: '2px solid #a07d3b',
                  color: '#a07d3b', fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', fontWeight: 'bold'
                }}>
                  ✓
                </div>

                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 38, color: '#1a2e1a', fontWeight: 400, marginBottom: 12 }}>
                  Priority Access Confirmed
                </h3>

                <p style={{ fontSize: 15.5, color: '#3d523d', lineHeight: 1.7, marginBottom: 28, maxWidth: 520, margin: '0 auto 28px' }}>
                  Thank you, <strong>{lead.name}</strong>. Your early access request has been registered. You will receive first-tier floor plans and priority allocation before public announcement.
                </p>

                <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a
                    href="uploads/Aranya brochure.pdf"
                    download
                    style={{
                      background: 'linear-gradient(135deg, #c9a96e 0%, #b89355 100%)',
                      color: '#ffffff',
                      padding: '14px 28px',
                      borderRadius: 4,
                      textDecoration: 'none',
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      boxShadow: '0 6px 18px rgba(184, 147, 85, 0.3)'
                    }}
                  >
                    Download Project Preview (PDF)
                  </a>

                  <a
                    href={`https://wa.me/919311852020?text=Hi%20Aranya%20Team%2C%20I%20registered%20for%20Early%20Access%20as%20${encodeURIComponent(lead.name)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#25D366',
                      color: '#ffffff',
                      border: 'none',
                      padding: '14px 26px',
                      borderRadius: 4,
                      textDecoration: 'none',
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase'
                    }}
                  >
                    WhatsApp Advisory Desk
                  </a>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ─── 4. FOOTER (WARM CREAM & ALABASTER ELEGANCE) ─── */}
      <footer style={{
        background: '#f2ede4',
        color: '#4d634d',
        padding: '56px clamp(20px, 6vw, 96px) 38px',
        borderTop: '1px solid rgba(201, 169, 110, 0.25)'
      }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            flexWrap: 'wrap', gap: 32, marginBottom: 36
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <img
                  src="uploads/logo design.webp"
                  alt="Aranya Logo"
                  style={{ height: 38, width: 'auto' }}
                />
                <span style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 22, letterSpacing: '0.18em', color: '#1a2e1a', fontWeight: 600
                }}>
                  ARANYA
                </span>
              </div>
              <p style={{ fontSize: 13.5, color: '#4d634d', lineHeight: 1.65, maxWidth: 420 }}>
                Rang Homes Aerocity, Dharapur, Guwahati, Assam 781017.<br />
                Conveniently located 10 minutes from Lokpriya Gopinath Bordoloi International Airport.
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 20, fontStyle: 'italic', color: '#8c6b2d', marginBottom: 6
              }}>
                "The whistling winds are getting greener."
              </p>
              <p style={{ fontSize: 13, color: '#4d634d' }}>
                VIP Desk: <a href="tel:+919311852020" style={{ color: '#8c6b2d', textDecoration: 'none', fontWeight: 600 }}>+91 93118 52020</a>
              </p>
            </div>
          </div>

          <GoldDivider style={{ marginBottom: 24 }} />

          <div style={{
            display: 'flex', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 16, fontSize: 11, lineHeight: 1.7,
            color: '#6e856e'
          }}>
            <p style={{ maxWidth: 780 }}>
              *RERA Registration: Under Process. Expected Possession: 2031. 70% open green space &amp; 16,000+ sq ft clubhouse are part of the proposed master plan. Information is indicative and subject to change without prior notice. Indotech Infracon Pvt. Ltd. © 2026.
            </p>
            <p>
              <a href="/" style={{ color: '#8c6b2d', textDecoration: 'none', marginRight: 18, fontWeight: 500 }}>View Full Website</a>
              <a href="https://wa.me/919311852020" target="_blank" rel="noopener noreferrer" style={{ color: '#8c6b2d', textDecoration: 'none', fontWeight: 500 }}>WhatsApp Advisory</a>
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
