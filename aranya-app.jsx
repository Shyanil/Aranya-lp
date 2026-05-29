
// ─── Aranya Landing Page — Main App ───────────────────────────────────────────

const { useState, useEffect, useRef, useCallback } = React;

// ── Scroll reveal hook ────────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ── SVG Logo placeholder ──────────────────────────────────────────────────────
function AranyaLogo({ color = '#c9a96e', size = 120 }) {
  return (
    <svg width={size} height={size * 0.55} viewBox="0 0 240 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tree glyph */}
      <path d="M120 10 L135 40 L128 40 L143 68 L134 68 L150 96 L90 96 L106 68 L97 68 L112 40 L105 40 Z" fill={color} opacity="0.9"/>
      <rect x="116" y="96" width="8" height="18" fill={color} opacity="0.7"/>
      {/* Text */}
      <text x="120" y="124" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="22" fontWeight="400" letterSpacing="8" fill={color}>ARANYA</text>
    </svg>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────
function GoldDivider({ style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...style }}>
      <div style={{ height: 1, flex: 1, background: 'linear-gradient(to right, transparent, #c9a96e)' }} />
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c9a96e', flexShrink: 0 }} />
      <div style={{ height: 1, flex: 1, background: 'linear-gradient(to left, transparent, #c9a96e)' }} />
    </div>
  );
}

// ── Nature SVG backgrounds ─────────────────────────────────────────────────────
function TreeSilhouette({ opacity = 0.06, color = '#1a2e1a' }) {
  return (
    <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '45%', pointerEvents: 'none' }}
      viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
      {/* Tree silhouettes */}
      {[0,80,160,260,370,490,620,760,880,1000,1120,1250,1360].map((x, i) => {
        const h = [180,220,150,200,170,240,160,210,190,175,230,155,195][i];
        const w = h * 0.55;
        return (
          <g key={i} opacity={opacity}>
            <polygon points={`${x},${300} ${x+w/2},${300-h} ${x+w},${300}`} fill={color} />
            <rect x={x + w/2 - 5} y={300 - 30} width={10} height={30} fill={color} />
          </g>
        );
      })}
    </svg>
  );
}

// ── Sticky Navigation ─────────────────────────────────────────────────────────
function Nav({ tweaks }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { label: 'The Vision', href: '#manifesto' },
    { label: 'Life at Aranya', href: '#wellness' },
    { label: 'Club Aranya', href: '#club' },
    { label: 'Homes', href: '#homes' },
    { label: 'Location', href: '#location' },
  ];

  const navBg = scrolled
    ? `rgba(${tweaks.darkNav ? '26,46,26' : '245,240,232'}, 0.97)`
    : 'transparent';
  const textColor = scrolled ? (tweaks.darkNav ? '#f5f0e8' : '#1a2e1a') : '#f5f0e8';

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 48px',
      height: 72,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: navBg,
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      transition: 'all 0.5s ease',
      borderBottom: scrolled ? `1px solid rgba(201,169,110,${tweaks.darkNav ? '0.3' : '0.2'})` : 'none',
    }}>
      <a href="#hero" style={{ textDecoration: 'none' }}>
        <AranyaLogo color={scrolled && !tweaks.darkNav ? '#1a2e1a' : '#c9a96e'} size={70} />
      </a>

      {/* Desktop links */}
      <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
        {links.map(l => (
          <a key={l.href} href={l.href} style={{
            color: textColor, textDecoration: 'none',
            fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 400,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            transition: 'color 0.3s',
            opacity: 0.85,
          }}
            onMouseEnter={e => e.target.style.color = '#c9a96e'}
            onMouseLeave={e => e.target.style.color = textColor}
          >{l.label}</a>
        ))}
        <a href="#enquire" style={{
          color: '#c9a96e', border: '1px solid #c9a96e',
          padding: '8px 24px', textDecoration: 'none',
          fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 500,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          transition: 'all 0.3s',
        }}
          onMouseEnter={e => { e.target.style.background = '#c9a96e'; e.target.style.color = '#1a2e1a'; }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#c9a96e'; }}
        >Enquire Now</a>
      </div>
    </nav>
  );
}

// ── Hero Section ──────────────────────────────────────────────────────────────
function Hero({ tweaks }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const overlayOpacity = tweaks.heroOverlay / 100;

  return (
    <section id="hero" style={{
      position: 'relative', width: '100%', height: '100vh', minHeight: 700,
      overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Layered nature background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse at 30% 60%, rgba(42,74,42,0.85) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 30%, rgba(26,46,26,0.7) 0%, transparent 50%),
          linear-gradient(160deg, #0d1f0d 0%, #1a3420 35%, #243a28 60%, #1a2e1a 100%)
        `,
      }} />

      {/* Ambient light rays */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        background: `
          radial-gradient(ellipse 40% 70% at 65% 20%, rgba(201,169,110,0.12) 0%, transparent 70%),
          radial-gradient(ellipse 30% 50% at 20% 80%, rgba(122,158,126,0.15) 0%, transparent 60%)
        `,
      }} />

      {/* Subtle texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        opacity: 0.4,
      }} />

      {/* Tree silhouettes at bottom */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '35%', pointerEvents: 'none' }}
        viewBox="0 0 1440 260" preserveAspectRatio="xMidYMax meet">
        {[
          [0, 200, 0.6], [70, 240, 0.7], [150, 180, 0.5], [240, 260, 0.8],
          [340, 195, 0.6], [440, 250, 0.75], [560, 170, 0.55], [670, 230, 0.7],
          [780, 210, 0.65], [900, 255, 0.8], [1020, 180, 0.6], [1130, 220, 0.7],
          [1250, 200, 0.65], [1360, 245, 0.75],
        ].map(([x, h, op], i) => {
          const w = h * 0.5;
          return (
            <g key={i} opacity={op * 0.5}>
              <polygon points={`${x},260 ${x + w / 2},${260 - h} ${x + w},260`} fill="#0a1a0a" />
              <rect x={x + w / 2 - 4} y={260 - 20} width={8} height={20} fill="#0a1a0a" />
            </g>
          );
        })}
      </svg>

      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: `rgba(10,20,10,${overlayOpacity})` }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px',
        maxWidth: 960,
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 1.2s ease, transform 1.2s ease',
      }}>
        <div style={{
          fontFamily: 'DM Sans, sans-serif', fontSize: 11, letterSpacing: '0.3em',
          textTransform: 'uppercase', color: '#c9a96e', marginBottom: 28,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1.4s ease 0.3s',
        }}>
          RH AEROCITY,DHARAPUR,GUWAHATI, ASSAM
        </div>

        <div style={{
          fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(52px, 8vw, 100px)',
          fontWeight: 300, lineHeight: 1.05, color: '#f5f0e8',
          letterSpacing: '-0.01em', marginBottom: 12,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1.2s ease 0.15s',
        }}>
          Your Sanctuary
        </div>
        <div style={{
          fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(52px, 8vw, 100px)',
          fontWeight: 300, fontStyle: 'italic', lineHeight: 1.05, color: '#c9a96e',
          letterSpacing: '-0.01em', marginBottom: 40,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1.2s ease 0.25s',
        }}>
          of Senses.
        </div>

        <p style={{
          fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 300,
          color: 'rgba(245,240,232,0.75)', letterSpacing: '0.04em', lineHeight: 1.9,
          maxWidth: 540, margin: '0 auto 52px',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1.2s ease 0.4s',
        }}>
          2 towers · 257 homes · 70% open green · RH Aerocity, Guwahati
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap',
          opacity: loaded ? 1 : 0, transition: 'opacity 1.2s ease 0.55s' }}>
          <a href="#enquire" style={{
            display: 'inline-block',
            background: '#c9a96e', color: '#1a2e1a',
            padding: '16px 44px', textDecoration: 'none',
            fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 500,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            transition: 'all 0.35s ease',
          }}
            onMouseEnter={e => { e.target.style.background = '#dfc28e'; e.target.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.target.style.background = '#c9a96e'; e.target.style.transform = 'translateY(0)'; }}
          >Schedule a Visit</a>
          <a href="#manifesto" style={{
            display: 'inline-block',
            background: 'transparent', color: '#f5f0e8',
            padding: '16px 44px', textDecoration: 'none',
            fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 400,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            border: '1px solid rgba(245,240,232,0.35)',
            transition: 'all 0.35s ease',
          }}
            onMouseEnter={e => { e.target.style.borderColor = '#c9a96e'; e.target.style.color = '#c9a96e'; }}
            onMouseLeave={e => { e.target.style.borderColor = 'rgba(245,240,232,0.35)'; e.target.style.color = '#f5f0e8'; }}
          >Discover More</a>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{
        position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        opacity: loaded ? 0.5 : 0, transition: 'opacity 2s ease 1s',
      }}>
        <div style={{ fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.25em', color: '#f5f0e8', textTransform: 'uppercase' }}>Scroll</div>
        <div style={{
          width: 1, height: 48, background: 'linear-gradient(to bottom, rgba(201,169,110,0.8), transparent)',
          animation: 'scrollPulse 2s ease-in-out infinite',
        }} />
      </div>
      <style>{`
        @keyframes scrollPulse { 0%,100%{opacity:0.5;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.2)} }
      `}</style>
    </section>
  );
}

// ── Stats Bar ─────────────────────────────────────────────────────────────────
function StatsBar() {
  const [ref, visible] = useReveal(0.3);
  const stats = [
    { value: '257', label: 'Curated Residences' },
    { value: '70%', label: 'Green Open Space' },
    { value: '16,000+', label: 'Sq Ft Clubhouse' },
    { value: 'Oasis', label: 'Swimming Pool' },
    { value: '2', label: 'Iconic Towers' },
  ];
  return (
    <div ref={ref} style={{
      background: '#1a2e1a', padding: '52px 48px',
      display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0,
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          textAlign: 'center', padding: '0 24px',
          borderRight: i < stats.length - 1 ? '1px solid rgba(201,169,110,0.2)' : 'none',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: `opacity 0.8s ease ${i * 0.1}s, transform 0.8s ease ${i * 0.1}s`,
        }}>
          <div style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: 44, fontWeight: 300,
            color: '#c9a96e', lineHeight: 1,
          }}>{s.value}</div>
          <div style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 400,
            color: 'rgba(245,240,232,0.55)', letterSpacing: '0.12em',
            textTransform: 'uppercase', marginTop: 10,
          }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Brand Manifesto ───────────────────────────────────────────────────────────
function Manifesto() {
  const [ref, visible] = useReveal(0.2);
  return (
    <section id="manifesto" style={{
      padding: 'clamp(80px, 10vw, 140px) clamp(24px, 8vw, 140px)',
      background: '#f5f0e8', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', right: -60, top: '50%', transform: 'translateY(-50%)',
        fontFamily: 'Cormorant Garamond, serif', fontSize: 280, fontWeight: 300,
        color: 'rgba(26,46,26,0.04)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
      }}>Aranya</div>

      <div ref={ref} style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 80, alignItems: 'center' }}>
          <div style={{
            opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-30px)',
            transition: 'opacity 1s ease, transform 1s ease',
          }}>
            <div style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 11, letterSpacing: '0.3em',
              textTransform: 'uppercase', color: '#c9a96e', marginBottom: 20,
            }}>The Vision</div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(36px,4vw,56px)',
              fontWeight: 300, lineHeight: 1.2, color: '#1a2e1a',
            }}>
              Where the forest<br /><em>breathes you in.</em>
            </h2>
            <GoldDivider style={{ margin: '32px 0', maxWidth: 240 }} />
            <div style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 12, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: '#7a9e7e',
            }}>RH AEROCITY,DHARAPUR,GUWAHATI, ASSAM</div>
          </div>

          <div style={{
            opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(30px)',
            transition: 'opacity 1s ease 0.2s, transform 1s ease 0.2s',
          }}>
            <p style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(20px,2.2vw,26px)',
              fontWeight: 300, fontStyle: 'italic', lineHeight: 1.75,
              color: '#2a3a2a', marginBottom: 28,
            }}>
              "A home that quietens the mind. Sunlit rooms, open corridors, and a community woven through greenery — 
              every element of Aranya is designed to restore what urban life slowly takes away."
            </p>
            <p style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 300,
              lineHeight: 1.9, color: '#4a5a4a', marginBottom: 24,
            }}>
              Nestled within RH Aerocity's emerging residential landscape, Aranya rises from 70% open green land. 
              Two towers. 257 homes. A single, quiet conviction — that living well means living close to nature.
            </p>
            <p style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 300,
              lineHeight: 1.9, color: '#4a5a4a',
            }}>
              Here, you don't escape to nature on weekends. You wake up inside it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Sustainable Atmos ─────────────────────────────────────────────────────────
function SustainableAtmos() {
  const [ref, visible] = useReveal(0.15);
  const zones = [
    {
      title: 'The Urban Boulevard',
      sub: 'Shared Green Spine',
      copy: 'The central stretch of curated greenery shared by both towers — a living corridor where light and shadow play through the day.',
      icon: '⬡',
    },
    {
      title: 'The Urban Oasis',
      sub: 'Cool & Immersive',
      copy: 'Tree-lined pathways and layered gardens create a cooler microclimate. Your peripheral vision, at all times, fills with green.',
      icon: '◈',
    },
  ];

  const amenities = [
    'Butterfly Garden', 'Bamboo Garden', 'Hedge Garden',
    'Flower Garden', 'Aroma Garden', 'Ginger Garden',
    'Mound Garden', 'Landscape Lawn', 'Palm Court',
    'Floating Cabana', 'Sculpture Garden', 'Pavilion Garden',
  ];

  return (
    <section id="wellness" style={{
      background: '#1a2e1a', position: 'relative', overflow: 'hidden',
      padding: 'clamp(80px,10vw,140px) clamp(24px,8vw,120px)',
    }}>
      <TreeSilhouette opacity={0.08} color="#0a1a0a" />

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: '40%', height: '60%',
        background: 'radial-gradient(ellipse at top right, rgba(122,158,126,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div ref={ref} style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{
          textAlign: 'center', marginBottom: 72,
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}>
          <div style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: 11, letterSpacing: '0.3em',
            textTransform: 'uppercase', color: '#c9a96e', marginBottom: 20,
          }}>Sustainable Atmos</div>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(36px,4.5vw,60px)',
            fontWeight: 300, color: '#f5f0e8', lineHeight: 1.15,
          }}>
            A pathway to tranquility,<br /><em style={{ color: '#c9a96e' }}>surrounded by nature's embrace.</em>
          </h2>
        </div>

        {/* Two zones */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, marginBottom: 64 }}>
          {zones.map((z, i) => (
            <div key={i} style={{
              background: 'rgba(245,240,232,0.04)',
              border: '1px solid rgba(201,169,110,0.15)',
              padding: '48px 44px',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(30px)',
              transition: `opacity 0.8s ease ${0.2 + i * 0.15}s, transform 0.8s ease ${0.2 + i * 0.15}s`,
            }}>
              <div style={{
                fontFamily: 'Cormorant Garamond, serif', fontSize: 32, color: '#7a9e7e', marginBottom: 8,
              }}>{z.icon}</div>
              <div style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 10, letterSpacing: '0.25em',
                textTransform: 'uppercase', color: '#c9a96e', marginBottom: 12,
              }}>{z.sub}</div>
              <h3 style={{
                fontFamily: 'Cormorant Garamond, serif', fontSize: 28, fontWeight: 400,
                color: '#f5f0e8', marginBottom: 16,
              }}>{z.title}</h3>
              <p style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 300,
                color: 'rgba(245,240,232,0.65)', lineHeight: 1.8,
              }}>{z.copy}</p>
            </div>
          ))}
        </div>

        {/* Amenity tags */}
        <div style={{
          textAlign: 'center',
          opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.5s',
        }}>
          <div style={{
            fontFamily: 'DM Sans', fontSize: 11, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)', marginBottom: 24,
          }}>Landscape Highlights</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {amenities.map((a, i) => (
              <span key={i} style={{
                fontFamily: 'DM Sans', fontSize: 12, fontWeight: 300,
                color: 'rgba(245,240,232,0.7)', letterSpacing: '0.05em',
                padding: '8px 18px', border: '1px solid rgba(201,169,110,0.2)',
                transition: 'all 0.3s',
                cursor: 'default',
              }}
                onMouseEnter={e => { e.target.style.borderColor = '#c9a96e'; e.target.style.color = '#c9a96e'; }}
                onMouseLeave={e => { e.target.style.borderColor = 'rgba(201,169,110,0.2)'; e.target.style.color = 'rgba(245,240,232,0.7)'; }}
              >{a}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Wellness Activities ───────────────────────────────────────────────────────
function WellnessSection() {
  const [ref, visible] = useReveal(0.15);
  const items = [
    { category: 'Physical Wellness', items: ['Swimming Pool', 'Jogging Track', 'Multipurpose Court', 'Gym — Active @Aranya'] },
    { category: 'Emotional & Mental', items: ['Butterfly Garden', 'Bamboo Garden', 'Hedge Garden', 'Flower Garden', 'Landscape Lawn'] },
    { category: 'Social & Community', items: ['Club Aranya — 16,000 sq ft', 'Rooftop Social', 'Banquet Hall', 'Open Café & Restaurant', 'Mini Theatre'] },
    { category: 'For Children', items: ['EIEIO Play Studio', "Kids' Play Area", 'Children\'s Outdoor Zone', 'Toddler\'s Splash Area', 'Stargazing Deck'] },
  ];
  return (
    <section style={{
      background: '#f5f0e8',
      padding: 'clamp(80px,10vw,140px) clamp(24px,8vw,120px)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start',
        }}>
          <div style={{
            position: 'sticky', top: 120,
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}>
            <div style={{
              fontFamily: 'DM Sans', fontSize: 11, letterSpacing: '0.3em',
              textTransform: 'uppercase', color: '#c9a96e', marginBottom: 20,
            }}>Holistic Wellness</div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(32px,3.5vw,50px)',
              fontWeight: 300, lineHeight: 1.2, color: '#1a2e1a', marginBottom: 24,
            }}>Step into serenity with<br /><em>nature-inspired living.</em></h2>
            <GoldDivider style={{ maxWidth: 180, marginBottom: 24 }} />
            <p style={{
              fontFamily: 'DM Sans', fontSize: 14, fontWeight: 300,
              color: '#4a5a4a', lineHeight: 1.9,
            }}>
              Designed to encourage outdoor activities while preserving the tranquillity of the space. 
              Whether a morning walk or an evening swim, every moment feels unhurried.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            {items.map((group, i) => (
              <div key={i} style={{
                background: i % 2 === 0 ? '#ede7d9' : '#e6dfd1',
                padding: '36px 32px',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.7s ease ${0.1 + i * 0.1}s, transform 0.7s ease ${0.1 + i * 0.1}s`,
              }}>
                <div style={{
                  fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: '#7a9e7e', marginBottom: 16,
                }}>{group.category}</div>
                <ul style={{ listStyle: 'none' }}>
                  {group.items.map((item, j) => (
                    <li key={j} style={{
                      fontFamily: 'DM Sans', fontSize: 14, fontWeight: 300,
                      color: '#2a3a2a', padding: '7px 0',
                      borderBottom: j < group.items.length - 1 ? '1px solid rgba(26,46,26,0.08)' : 'none',
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#c9a96e', flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Club Aranya ───────────────────────────────────────────────────────────────
function ClubAranya() {
  const [ref, visible] = useReveal(0.15);
  const [activeTab, setActiveTab] = useState(0);

  const spaces = [
    { name: 'ACTIVE@ARANYA', desc: 'A premium gymnasium where strength meets form. Designed for those who treat fitness as a philosophy, not a routine.', tag: 'Ground Level' },
    { name: 'Open Café & Restaurant', desc: 'Brewing conversations over curated food and coffee. The place where the community gathers, lingers, and connects.', tag: 'Ground Level' },
    { name: 'Mini Theatre', desc: 'Intimate cinematic experiences for residents. Private screenings, film evenings, curated cultural programmes.', tag: 'Ground Level' },
    { name: 'EIEIO Play Studio', desc: "A toddlers' world where little feet make big memories. Thoughtfully designed for safety, play, and imagination.", tag: 'Ground Level' },
    { name: 'Rooftop Social', desc: 'Bar counter, yoga deck, stargazing area, party lawn — the sky becomes your living room when the day winds down.', tag: 'Rooftop' },
    { name: 'Banquet Hall', desc: 'A column-free space designed for celebrations to shine. Double-height ceilings, versatile configuration, impeccable finish.', tag: 'Ground Level' },
  ];

  return (
    <section id="club" style={{
      background: '#243a24', position: 'relative', overflow: 'hidden',
      padding: 'clamp(80px,10vw,140px) clamp(24px,8vw,120px)',
    }}>
      <div style={{
        position: 'absolute', top: '-5%', left: '50%', transform: 'translateX(-50%)',
        width: '80%', height: '60%',
        background: 'radial-gradient(ellipse, rgba(201,169,110,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div ref={ref} style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{
          textAlign: 'center', marginBottom: 60,
          opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease',
        }}>
          <img src="uploads/logo design.jpeg" alt="Club Aranya Logo" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 20, border: '1px solid rgba(201,169,110,0.3)', padding: '4px', background: 'rgba(255,255,255,0.05)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)' }} />
          <div style={{
            fontFamily: 'DM Sans', fontSize: 22, fontWeight: 500, letterSpacing: '0.32em',
            textTransform: 'uppercase', color: '#c9a96e', marginBottom: 20,
          }}>Club Aranya</div>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(36px,4.5vw,60px)',
            fontWeight: 300, color: '#f5f0e8', lineHeight: 1.15, marginBottom: 20,
          }}>
            Double-tiered social spaces<br /><em style={{ color: '#c9a96e' }}>spread over 16,000+ sq ft.</em>
          </h2>
          <p style={{
            fontFamily: 'DM Sans', fontSize: 15, fontWeight: 300,
            color: 'rgba(245,240,232,0.6)', maxWidth: 560, margin: '0 auto',
            lineHeight: 1.8,
          }}>
            The club life invites conversations and fosters community. 
            Social, inclusive, rooted in warmth — this is where unwinding hours feel special.
          </p>
        </div>

        {/* Tab navigation */}
        <div style={{ display: 'flex', gap: 3, marginBottom: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
          {spaces.map((s, i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{
              fontFamily: 'DM Sans', fontSize: 11, fontWeight: 400,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '12px 20px', border: 'none', cursor: 'pointer',
              background: activeTab === i ? '#c9a96e' : 'rgba(245,240,232,0.07)',
              color: activeTab === i ? '#1a2e1a' : 'rgba(245,240,232,0.6)',
              transition: 'all 0.3s ease',
            }}>{s.name}</button>
          ))}
        </div>

        {/* Active space detail */}
        <div style={{
          background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(201,169,110,0.15)',
          padding: '56px 64px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64,
          alignItems: 'center',
          opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.3s',
        }}>
          <div>
            <div style={{
              fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: '#7a9e7e', marginBottom: 16,
            }}>{spaces[activeTab].tag}</div>
            <h3 style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: 40, fontWeight: 300,
              color: '#f5f0e8', marginBottom: 24, lineHeight: 1.15,
            }}>{spaces[activeTab].name}</h3>
            <p style={{
              fontFamily: 'DM Sans', fontSize: 15, fontWeight: 300,
              color: 'rgba(245,240,232,0.7)', lineHeight: 1.9,
            }}>{spaces[activeTab].desc}</p>
          </div>

          {/* Visual placeholder */}
          <div style={{
            height: 280, background: 'rgba(122,158,126,0.1)',
            border: '1px solid rgba(201,169,110,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(26,46,26,0.6) 0%, rgba(36,58,36,0.3) 100%)',
            }} />
            <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{
                fontFamily: 'Cormorant Garamond, serif', fontSize: 56, fontWeight: 300,
                color: 'rgba(201,169,110,0.4)', lineHeight: 1,
              }}>◈</div>
              <div style={{
                fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: 'rgba(245,240,232,0.3)', marginTop: 12,
              }}>Artist's Impression</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Homes / Units ─────────────────────────────────────────────────────────────
function HomesSection({ tweaks }) {
  const [ref, visible] = useReveal(0.15);
  const [activeUnit, setActiveUnit] = useState(0);

  const units = [
    {
      type: '3 BHK + 2T', label: 'Celestial',
      size: '1,148 – 1,479 sq ft', floors: 'Ground to 10th Floor',
      highlights: ['East-West cross ventilation', 'Utility balcony with kitchen', 'Jumbo vitrified tile flooring', 'Smart digital door lock'],
      tag: 'Most Popular',
      tower: 'T2',
    },
    {
      type: '3 BHK + 3T + Terrace', label: 'Garden Home',
      size: '2,280 – 2,687 sq ft', floors: '1st & 2nd Floor',
      highlights: ['Private terrace up to 1,326 sq ft', 'Garden-level living', 'Exclusive green views', 'Personal outdoor escape'],
      tag: 'Limited Edition',
      tower: 'T1',
    },
    {
      type: '4 BHK', label: 'Prestige',
      size: '1,623 – 1,895 sq ft', floors: '1st Floor onwards',
      highlights: ['Dedicated staff room', 'Puja room option', 'Expansive balconies', 'Corner apartment layouts'],
      tag: 'Select Floors',
      tower: 'T1',
    },
    {
      type: '4 BHK + Terrace', label: 'Signature',
      size: '2,532 – 3,044 sq ft', floors: '1st–2nd Floor',
      highlights: ['Private terrace up to 1,177 sq ft', 'Puja + staff rooms', 'Premium tower views', 'Legacy-grade living'],
      tag: 'Ultra Premium',
      tower: 'T1',
    },
  ];

  return (
    <section id="homes" style={{
      background: '#f5f0e8', padding: 'clamp(80px,10vw,140px) clamp(24px,8vw,120px)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', left: -80, bottom: -80,
        fontFamily: 'Cormorant Garamond, serif', fontSize: 320, fontWeight: 300,
        color: 'rgba(26,46,26,0.03)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
      }}>Home</div>

      <div ref={ref} style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{
          textAlign: 'center', marginBottom: 64,
          opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease',
        }}>
          <div style={{
            fontFamily: 'DM Sans', fontSize: 11, letterSpacing: '0.3em',
            textTransform: 'uppercase', color: '#c9a96e', marginBottom: 20,
          }}>Celestial Apartments</div>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(36px,4.5vw,60px)',
            fontWeight: 300, color: '#1a2e1a', lineHeight: 1.15,
          }}>
            Curated, comfortable,<br /><em>consciously designed.</em>
          </h2>
        </div>

        {/* Unit selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 3, marginBottom: 3 }}>
          {units.map((u, i) => (
            <button key={i} onClick={() => setActiveUnit(i)} style={{
              background: activeUnit === i ? '#1a2e1a' : '#ede7d9',
              border: 'none', cursor: 'pointer', padding: '24px 20px', textAlign: 'left',
              transition: 'all 0.3s',
            }}>
              <div style={{
                fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: activeUnit === i ? '#c9a96e' : '#7a9e7e',
                marginBottom: 8,
              }}>{u.type}</div>
              <div style={{
                fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 400,
                color: activeUnit === i ? '#f5f0e8' : '#1a2e1a',
              }}>{u.label}</div>
              {u.tag && (
                <div style={{
                  display: 'inline-block', marginTop: 10,
                  fontFamily: 'DM Sans', fontSize: 9, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: '#c9a96e',
                  borderBottom: '1px solid #c9a96e', paddingBottom: 2,
                }}>{u.tag}</div>
              )}
            </button>
          ))}
        </div>

        {/* Active unit detail */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 3,
          opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.2s',
        }}>
          {/* Floor plan placeholder */}
          <div style={{
            background: '#ede7d9', minHeight: 380,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(245,240,232,0.5) 0%, rgba(237,231,217,0.8) 100%)',
            }} />
            {/* Schematic floor plan SVG placeholder */}
            <svg viewBox="0 0 300 280" width="240" style={{ position: 'relative', zIndex: 1, opacity: 0.7 }}>
              {/* Outer walls */}
              <rect x="20" y="20" width="260" height="240" fill="none" stroke="#7a9e7e" strokeWidth="2" />
              {/* Rooms */}
              <rect x="20" y="20" width="120" height="100" fill="rgba(122,158,126,0.12)" stroke="#7a9e7e" strokeWidth="1" />
              <rect x="140" y="20" width="140" height="100" fill="rgba(201,169,110,0.1)" stroke="#7a9e7e" strokeWidth="1" />
              <rect x="20" y="120" width="80" height="80" fill="rgba(122,158,126,0.08)" stroke="#7a9e7e" strokeWidth="1" />
              <rect x="100" y="120" width="80" height="80" fill="rgba(122,158,126,0.08)" stroke="#7a9e7e" strokeWidth="1" />
              <rect x="180" y="120" width="100" height="80" fill="rgba(201,169,110,0.08)" stroke="#7a9e7e" strokeWidth="1" />
              <rect x="20" y="200" width="260" height="60" fill="rgba(122,158,126,0.06)" stroke="#7a9e7e" strokeWidth="1" />
              {/* Labels */}
              <text x="80" y="74" textAnchor="middle" fontFamily="DM Sans" fontSize="9" fill="#7a9e7e">Master Bed</text>
              <text x="210" y="74" textAnchor="middle" fontFamily="DM Sans" fontSize="9" fill="#7a9e7e">Living / Dining</text>
              <text x="60" y="164" textAnchor="middle" fontFamily="DM Sans" fontSize="8" fill="#7a9e7e">Bed 2</text>
              <text x="140" y="164" textAnchor="middle" fontFamily="DM Sans" fontSize="8" fill="#7a9e7e">Bed 3</text>
              <text x="230" y="164" textAnchor="middle" fontFamily="DM Sans" fontSize="8" fill="#7a9e7e">Kitchen</text>
              <text x="150" y="234" textAnchor="middle" fontFamily="DM Sans" fontSize="8" fill="#7a9e7e">Balcony</text>
            </svg>
            <div style={{
              position: 'absolute', bottom: 16, right: 16,
              fontFamily: 'DM Sans', fontSize: 9, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'rgba(26,46,26,0.4)',
            }}>Indicative Layout</div>
          </div>

          {/* Specs */}
          <div style={{ background: '#ede7d9', padding: '44px 40px' }}>
            <div style={{
              fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: '#c9a96e', marginBottom: 8,
            }}>{units[activeUnit].type}</div>
            <h3 style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 300,
              color: '#1a2e1a', marginBottom: 24,
            }}>{units[activeUnit].label}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
              <div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7a9e7e', marginBottom: 6 }}>Size Range</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 400, color: '#1a2e1a' }}>{units[activeUnit].size}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7a9e7e', marginBottom: 6 }}>Available</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, fontWeight: 400, color: '#1a2e1a' }}>{units[activeUnit].floors}</div>
              </div>
              {units[activeUnit].tower ? (
                <>
                  <div>
                    <div style={{ fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7a9e7e', marginBottom: 6 }}>Tower</div>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 22, fontWeight: 500, color: '#1a2e1a' }}>{units[activeUnit].tower && units[activeUnit].tower.replace('T', 'T ')}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7a9e7e', marginBottom: 6 }}>Possession</div>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 400, color: '#1a2e1a' }}>2031</div>
                  </div>
                </>
              ) : (
                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7a9e7e', marginBottom: 6 }}>Possession</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 400, color: '#1a2e1a' }}>2031</div>
                </div>
              )}
            </div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7a9e7e', marginBottom: 16 }}>Highlights</div>
              {units[activeUnit].highlights.map((h, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '9px 0', borderBottom: '1px solid rgba(26,46,26,0.08)',
                  fontFamily: 'DM Sans', fontSize: 14, fontWeight: 300, color: '#2a3a2a',
                }}>
                  <span style={{ width: 4, height: 4, background: '#c9a96e', borderRadius: '50%', flexShrink: 0 }} />
                  {h}
                </div>
              ))}
            </div>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontStyle: 'italic',
              color: '#1a2e1a', marginBottom: 24,
            }}>₹5,000 – ₹7,000 per sq ft</div>
            <a href="#enquire" style={{
              display: 'inline-block',
              background: '#1a2e1a', color: '#c9a96e',
              padding: '14px 36px', textDecoration: 'none',
              fontFamily: 'DM Sans', fontSize: 11, fontWeight: 500,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.target.style.background = '#c9a96e'; e.target.style.color = '#1a2e1a'; }}
              onMouseLeave={e => { e.target.style.background = '#1a2e1a'; e.target.style.color = '#c9a96e'; }}
            >Express Interest</a>
          </div>
        </div>
      </div>
    </section>
  );
}



    // ── Location ──────────────────────────────────────────────────────────────────
    function LocationSection() {
  const [ref, visible] = useReveal(0.15);
  const [activeCategory, setActiveCategory] = useState(0);

  const googleMapsUrl = "https://www.google.com/maps/place/Rang+Homes+Dharapur/@26.1342888,91.6106832,121m/data=!3m1!1e3!4m6!3m5!1s0x375a45e9f3abda0b:0xa3fdc54d80ad06b1!8m2!3d26.1355178!4d91.6115151!16s%2Fg%2F11g4d6v_tz?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D";

  const categories = [
    {
      name: 'Education', color: '#7a9e7e',
      places: [
        { name: 'Dharapur Higher Secondary', dist: '2.2 km' },
        { name: 'Kinderjoy Montessori and Playschool', dist: '2.8 km' },
        { name: 'Radha Bora High School', dist: '3.6 km' },
        { name: 'Chandraprava Bora High School, Azara', dist: '3.7 km' },
        { name: 'St. Joseph\'s School', dist: '5.1 km' },
      ],
    },
    {
      name: 'Healthcare', color: '#9e8a7a',
      places: [
        { name: 'Garal PHC', dist: '950 m' },
        { name: 'Azara PHC', dist: '3.8 km' },
        { name: 'Guwahati University Hospital', dist: '10.7 km' },
        { name: 'Apollo Excelcare Hospital', dist: '13.2 km' },
      ],
    },
    {
      name: 'Connectivity', color: '#c9a96e',
      places: [
        { name: 'International Airport', dist: '4.7 KM' },
        { name: 'Dharapur Chariali', dist: '2.2 km' },
        { name: 'Jalukbari Flyover', dist: '10 km' },
        { name: 'BCPL Petrol Pump', dist: '650 m' },
      ],
    },
    {
      name: 'Lifestyle', color: '#a8c5ab',
      places: [
        { name: 'University Shopping Complex', dist: '6.6 km' },
        { name: 'Decathlon Azara', dist: '6.7 km' },
        { name: 'NCS Square Mall', dist: '9.0 km' },
        { name: 'Kiranshree Grand Hotel', dist: '3.7 km' },
      ],
    },
  ];

  return (
    <section id="location" style={{
      background: '#1a2e1a',
      padding: 'clamp(80px,10vw,140px) clamp(24px,8vw,120px)',
      position: 'relative', overflow: 'hidden',
    }}>
      <TreeSilhouette opacity={0.06} color="#0d1a0d" />

      <div ref={ref} style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 80, alignItems: 'start' }}>
          <div style={{
            opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}>
            <div style={{
              fontFamily: 'DM Sans', fontSize: 11, letterSpacing: '0.3em',
              textTransform: 'uppercase', color: '#c9a96e', marginBottom: 20,
            }}>Location</div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(32px,4vw,52px)',
              fontWeight: 300, color: '#f5f0e8', lineHeight: 1.2, marginBottom: 24,
            }}>
              A new chapter<br /><em style={{ color: '#c9a96e' }}>of urban living.</em>
            </h2>
            <GoldDivider style={{ marginBottom: 28, maxWidth: 200 }} />
            <p style={{
              fontFamily: 'DM Sans', fontSize: 15, fontWeight: 300,
              color: 'rgba(245,240,232,0.65)', lineHeight: 1.9, marginBottom: 36,
            }}>
              Located in Aerocity's rapidly developing residential belt on Dharapur- Palashbari Road, the perfect confluence of urban conveniences and an escape into nature.
            </p>
            {/* Map placeholder */}
            <div style={{
              background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(201,169,110,0.2)',
              height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden', cursor: 'pointer',
            }} onClick={() => { window.location.href = googleMapsUrl; }}>
              {/* Schematic map */}
              <svg viewBox="0 0 340 220" width="100%" style={{ opacity: 0.7 }}>
                {/* Roads */}
                <path d="M0,110 L340,110" stroke="rgba(201,169,110,0.4)" strokeWidth="3" />
                <path d="M170,0 L170,220" stroke="rgba(201,169,110,0.3)" strokeWidth="2" />
                <path d="M0,60 L340,160" stroke="rgba(245,240,232,0.15)" strokeWidth="1.5" />
                {/* Location dot */}
                <circle cx="170" cy="110" r="10" fill="#c9a96e" opacity="0.9" />
                <circle cx="170" cy="110" r="18" fill="none" stroke="#c9a96e" strokeWidth="1.5" opacity="0.5" />
                <circle cx="170" cy="110" r="28" fill="none" stroke="#c9a96e" strokeWidth="1" opacity="0.25" />
                {/* Red pin pointing to (170, 110) */}
                <g style={{ transform: 'translate(170px, 110px)', cursor: 'pointer' }} onClick={() => { window.location.href = googleMapsUrl; }}>
                  <path d="M0,0 C-6,-9 -12,-14 -12,-21 A12,12 0 1,1 12,-21 C12,-14 6,-9 0,0 Z" fill="#ff0000" />
                  <circle cx="0" cy="-21" r="4.5" fill="#faf8f3" />
                </g>
                {/* Landmark dots */}
                {[
                  [90, 70, 'Airport 4.7KM'], [280, 85, 'University'],
                  [60, 150, 'Hospital'], [280, 145, 'Mall'],
                ].map(([x, y, label], i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill="rgba(245,240,232,0.5)" />
                    <text x={x + 8} y={y + 4} fontFamily="DM Sans" fontSize="7" fill="rgba(245,240,232,0.5)">{label}</text>
                  </g>
                ))}
                {/* Aranya label */}
                <text x="185" y="106" fontFamily="Cormorant Garamond, serif" fontSize="11" fontStyle="italic" fill="#c9a96e">Aranya</text>
              </svg>
              <div style={{
                position: 'absolute', bottom: 12, right: 12,
                fontFamily: 'DM Sans', fontSize: 9, letterSpacing: '0.15em',
                textTransform: 'uppercase', color: 'rgba(245,240,232,0.3)',
              }}>Dharapur, Palashbari Road</div>
            </div>
          </div>

          <div style={{
            opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(30px)',
            transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
          }}>
            {/* Category tabs */}
            <div style={{ display: 'flex', gap: 3, marginBottom: 3, flexWrap: 'wrap' }}>
              {categories.map((c, i) => (
                <button key={i} onClick={() => setActiveCategory(i)} style={{
                  fontFamily: 'DM Sans', fontSize: 11, fontWeight: 400,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '10px 20px', border: 'none', cursor: 'pointer',
                  background: activeCategory === i ? c.color : 'rgba(245,240,232,0.07)',
                  color: activeCategory === i ? '#1a2e1a' : 'rgba(245,240,232,0.6)',
                  transition: 'all 0.3s ease',
                  flex: '1 1 auto',
                }}>{c.name}</button>
              ))}
            </div>
            <div style={{ background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(201,169,110,0.15)' }}>
              {categories[activeCategory].places.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '20px 32px',
                  borderBottom: i < categories[activeCategory].places.length - 1
                    ? '1px solid rgba(245,240,232,0.06)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: categories[activeCategory].color, flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: 'DM Sans', fontSize: 15, fontWeight: 300,
                      color: 'rgba(245,240,232,0.85)',
                    }}>{p.name}</span>
                  </div>
                  <span style={{
                    fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 300,
                    color: categories[activeCategory].color, flexShrink: 0,
                  }}>{p.dist}</span>
                </div>
              ))}
            </div>

            {/* Key highlight */}
            <div style={{
              marginTop: 32, padding: '32px', background: 'rgba(201,169,110,0.08)',
              border: '1px solid rgba(201,169,110,0.2)',
            }}>
              <div style={{
                fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px,3vw,40px)',
                fontWeight: 300, color: '#c9a96e', marginBottom: 8,
              }}>4.7 KM</div>
              <div style={{
                fontFamily: 'DM Sans', fontSize: 14, fontWeight: 300,
                color: 'rgba(245,240,232,0.7)',
              }}>From Lokpriya Gopinath Bordoloi International Airport</div>
            </div>
          </div>
        </div>
      </div>
      {/* Dedicated Premium Full-Screen Map Page Overlay Removed */}

    </section>
  );
}

// ── Developer Section ─────────────────────────────────────────────────────────
function DeveloperSection() {
  const [ref, visible] = useReveal(0.15);
  const projects = [
    { name: 'Rang Homes Phase 1', location: 'Dharapur, Guwahati', status: 'Delivered' },
    { name: 'Rang Homes Phase 2', location: 'Dharapur, Guwahati', status: 'Delivered' },
    { name: 'Rang Homes Punjabi Bagh', location: 'New Delhi', status: 'Delivered' },
  ];
  return (
    <section style={{
      background: '#ede7d9',
      padding: 'clamp(80px,10vw,140px) clamp(24px,8vw,120px)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 80, alignItems: 'center' }}>
          <div style={{
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}>
            <div style={{
              fontFamily: 'DM Sans', fontSize: 11, letterSpacing: '0.3em',
              textTransform: 'uppercase', color: '#c9a96e', marginBottom: 20,
            }}>About the Developer</div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(32px,4vw,52px)',
              fontWeight: 300, color: '#1a2e1a', lineHeight: 1.2, marginBottom: 28,
            }}>
              Built on integrity.<br /><em>Delivered with precision.</em>
            </h2>
            <p style={{
              fontFamily: 'DM Sans', fontSize: 15, fontWeight: 300,
              color: '#4a5a4a', lineHeight: 1.9, marginBottom: 20,
            }}>
              Indotech Infracon Private Limited — the force behind Aranya by Rang Homes - has shaped the residential landscape of Guwahati over eight years, delivering 600+ homes that stand as long-term assets for their residents.
            </p>
            <p style={{
              fontFamily: 'DM Sans', fontSize: 15, fontWeight: 300,
              color: '#4a5a4a', lineHeight: 1.9, marginBottom: 40,
            }}>
              Every project reflects a quiet conviction: quality must be consistent, details must be deliberate, 
              and every home must honour the trust placed in it.
            </p>

            {/* Trust signals */}
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[
                { value: '600+', label: 'Homes Delivered' },
                { value: '8+', label: 'Years of Trust' },
              ].map((t, i) => (
                <div key={i}>
                  <div style={{
                    fontFamily: 'Cormorant Garamond, serif', fontSize: 40, fontWeight: 300, color: '#1a2e1a',
                  }}>{t.value}</div>
                  <div style={{
                    fontFamily: 'DM Sans', fontSize: 11, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: '#7a9e7e',
                  }}>{t.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
          }}>
            <div style={{
              fontFamily: 'DM Sans', fontSize: 11, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: '#7a9e7e', marginBottom: 20,
            }}>Delivered Projects</div>
            {projects.map((p, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '20px 0',
                borderBottom: i < projects.length - 1 ? '1px solid rgba(26,46,26,0.1)' : 'none',
              }}>
                <div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 400, color: '#1a2e1a' }}>{p.name}</div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: 12, fontWeight: 300, color: '#6b6b6b', marginTop: 4 }}>{p.location}</div>
                </div>
                <div style={{
                  fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: '#7a9e7e',
                  border: '1px solid #7a9e7e', padding: '6px 14px',
                }}>{p.status}</div>
              </div>
            ))}

            <div style={{
              marginTop: 40, padding: '28px 32px',
              background: '#1a2e1a',
            }}>
              <div style={{
                fontFamily: 'DM Sans', fontSize: 11, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: '#c9a96e', marginBottom: 12,
              }}>Design Team</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  ['Principal Architect', 'Confluence Consultancy Services, Delhi'],
                  ['Landscape', 'S.P Consultants, Delhi'],
                  ['MEP', 'AEPL, Delhi'],
                  ['Structural', 'Swati Structure Solutions Pvt. Ltd, Delhi'],
                  ['Local Architect', 'Banka & Associates, Guwahati'],
                ].map(([role, firm], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'DM Sans', fontSize: 13, fontWeight: 300, color: 'rgba(245,240,232,0.5)' }}>{role}</span>
                    <span style={{ fontFamily: 'DM Sans', fontSize: 13, fontWeight: 400, color: 'rgba(245,240,232,0.85)' }}>{firm}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Lead Form ─────────────────────────────────────────────────────────────────
function EnquireForm({ tweaks }) {
  const [ref, visible] = useReveal(0.1);
  const [form, setForm] = useState({ name: '', phone: '', email: '', interest: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.phone.trim() || !/^\+?[\d\s-]{8,}$/.test(form.phone)) e.phone = true;
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = true;
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setSubmitted(true);
  };

  const inputStyle = (hasError) => ({
    width: '100%', background: 'transparent',
    border: `1px solid ${hasError ? '#e07a5f' : 'rgba(201,169,110,0.3)'}`,
    padding: '14px 20px',
    fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 300,
    color: '#f5f0e8',
    outline: 'none',
    transition: 'border-color 0.3s',
  });

  return (
    <section id="enquire" style={{
      background: tweaks.darkForm ? '#0d1a0d' : '#1a2e1a',
      padding: 'clamp(80px,10vw,140px) clamp(24px,8vw,120px)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(201,169,110,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <TreeSilhouette opacity={0.05} color="#0a1a0a" />

      <div ref={ref} style={{ maxWidth: 840, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{
          textAlign: 'center', marginBottom: 60,
          opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease',
        }}>
          <AranyaLogo color="#c9a96e" size={80} />
          <div style={{ marginTop: 32 }}>
            <div style={{
              fontFamily: 'DM Sans', fontSize: 11, letterSpacing: '0.3em',
              textTransform: 'uppercase', color: '#c9a96e', marginBottom: 20,
            }}>Begin Your Journey</div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(32px,4.5vw,56px)',
              fontWeight: 300, color: '#f5f0e8', lineHeight: 1.2, marginBottom: 20,
            }}>
              Your forest home<br /><em style={{ color: '#c9a96e' }}>awaits a conversation.</em>
            </h2>
            <p style={{
              fontFamily: 'DM Sans', fontSize: 15, fontWeight: 300,
              color: 'rgba(245,240,232,0.55)', maxWidth: 480, margin: '0 auto', lineHeight: 1.8,
            }}>
              A limited number of homes remain. Speak with our team to find yours.
            </p>
          </div>
        </div>

        {submitted ? (
          <div style={{
            textAlign: 'center', padding: '64px 40px',
            background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(201,169,110,0.2)',
            opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.2s',
          }}>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: 48, fontWeight: 300,
              color: '#c9a96e', marginBottom: 16,
            }}>✦</div>
            <h3 style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: 32, fontWeight: 300,
              color: '#f5f0e8', marginBottom: 16,
            }}>Thank you, {form.name.split(' ')[0]}.</h3>
            <p style={{
              fontFamily: 'DM Sans', fontSize: 15, fontWeight: 300,
              color: 'rgba(245,240,232,0.6)', lineHeight: 1.8,
            }}>
              Our team will reach out within 24 hours to schedule your private visit.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{
            opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.2s',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, marginBottom: 3 }}>
              <div>
                <label style={{
                  display: 'block', fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: 'rgba(245,240,232,0.5)', marginBottom: 8,
                }}>Full Name *</label>
                <input
                  type="text" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  style={inputStyle(errors.name)}
                  onFocus={e => e.target.style.borderColor = '#c9a96e'}
                  onBlur={e => e.target.style.borderColor = errors.name ? '#e07a5f' : 'rgba(201,169,110,0.3)'}
                />
              </div>
              <div>
                <label style={{
                  display: 'block', fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: 'rgba(245,240,232,0.5)', marginBottom: 8,
                }}>Phone Number *</label>
                <input
                  type="tel" value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 ———"
                  style={inputStyle(errors.phone)}
                  onFocus={e => e.target.style.borderColor = '#c9a96e'}
                  onBlur={e => e.target.style.borderColor = errors.phone ? '#e07a5f' : 'rgba(201,169,110,0.3)'}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, marginBottom: 3 }}>
              <div>
                <label style={{
                  display: 'block', fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: 'rgba(245,240,232,0.5)', marginBottom: 8,
                }}>Email Address *</label>
                <input
                  type="email" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com"
                  style={inputStyle(errors.email)}
                  onFocus={e => e.target.style.borderColor = '#c9a96e'}
                  onBlur={e => e.target.style.borderColor = errors.email ? '#e07a5f' : 'rgba(201,169,110,0.3)'}
                />
              </div>
              <div>
                <label style={{
                  display: 'block', fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: 'rgba(245,240,232,0.5)', marginBottom: 8,
                }}>Interest</label>
                <select
                  value={form.interest}
                  onChange={e => setForm(f => ({ ...f, interest: e.target.value }))}
                  style={{ ...inputStyle(false), cursor: 'pointer' }}
                >
                  <option value="" style={{ background: '#1a2e1a' }}>Select apartment type</option>
                  <option value="3bhk" style={{ background: '#1a2e1a' }}>3 BHK — Celestial</option>
                  <option value="3bhk-terrace" style={{ background: '#1a2e1a' }}>3 BHK + Terrace — Garden Home</option>
                  <option value="4bhk" style={{ background: '#1a2e1a' }}>4 BHK — Prestige</option>
                  <option value="4bhk-terrace" style={{ background: '#1a2e1a' }}>4 BHK + Terrace — Signature</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 3 }}>
              <label style={{
                display: 'block', fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: 'rgba(245,240,232,0.5)', marginBottom: 8,
              }}>Message (optional)</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Any specific questions or preferences..."
                rows={4}
                style={{ ...inputStyle(false), resize: 'vertical' }}
                onFocus={e => e.target.style.borderColor = '#c9a96e'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,169,110,0.3)'}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginTop: 24 }}>
              <p style={{
                fontFamily: 'DM Sans', fontSize: 12, fontWeight: 300,
                color: 'rgba(245,240,232,0.35)', lineHeight: 1.6, flex: 1, minWidth: 240,
              }}>
                Your information is held in strict confidence. We do not share details with third parties.
              </p>
              <button type="submit" style={{
                background: '#c9a96e', color: '#1a2e1a',
                border: 'none', cursor: 'pointer',
                padding: '18px 52px',
                fontFamily: 'DM Sans', fontSize: 12, fontWeight: 500,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                transition: 'all 0.35s ease',
                flexShrink: 0,
              }}
                onMouseEnter={e => { e.target.style.background = '#dfc28e'; e.target.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.target.style.background = '#c9a96e'; e.target.style.transform = 'translateY(0)'; }}
              >
                DOWNLOAD BROCHURE
              </button>
            </div>
          </form>
        )}

        {/* Contact details */}
        <div style={{
          marginTop: 64, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 3,
          opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.4s',
        }}>
          {[
            { label: 'Site Address', value: 'RH Aerocity, Dharapur\nPalashbari Road, Assam' },
            { label: 'Phone', value: '1800 12012 5555\n+91 11-71834410' },
            { label: 'Email', value: 'info@indogroup.in\nwww.ranghomes.com' },
          ].map((c, i) => (
            <div key={i} style={{
              background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(201,169,110,0.15)',
              padding: '24px 28px', textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: '#c9a96e', marginBottom: 10,
              }}>{c.label}</div>
              <div style={{
                fontFamily: 'DM Sans', fontSize: 13, fontWeight: 300,
                color: 'rgba(245,240,232,0.7)', whiteSpace: 'pre-line', lineHeight: 1.7,
              }}>{c.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      background: '#0d1a0d', padding: '40px clamp(24px,8vw,120px)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 40 }}>
          <AranyaLogo color="#c9a96e" size={80} />
          <div style={{ display: 'flex', gap: 32 }}>
            {['#manifesto','#wellness','#club','#homes','#location','#enquire'].map((href, i) => {
              const labels = ['Vision','Life','Club','Homes','Location','Enquire'];
              return (
                <a key={i} href={href} style={{
                  fontFamily: 'DM Sans', fontSize: 11, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'rgba(245,240,232,0.45)',
                  textDecoration: 'none', transition: 'color 0.3s',
                }}
                  onMouseEnter={e => e.target.style.color = '#c9a96e'}
                  onMouseLeave={e => e.target.style.color = 'rgba(245,240,232,0.45)'}
                >{labels[i]}</a>
              );
            })}
          </div>
        </div>
        <GoldDivider style={{ marginBottom: 28 }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <p style={{
            fontFamily: 'DM Sans', fontSize: 11, fontWeight: 300,
            color: 'rgba(245,240,232,0.25)', lineHeight: 1.7, maxWidth: 680,
          }}>
            RERA Registration: Under Process. Possession: 2031. Views and photographs used are artist's impressions for illustration purposes only. 
            The information, features and offerings are indicative and subject to change. This does not constitute an offer or commitment of any nature.
            Indotech Infracon Pvt. Ltd. © 2026. All rights reserved.
          </p>
          <div style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: 18, fontStyle: 'italic',
            color: 'rgba(201,169,110,0.35)',
          }}>
            "The whistling winds are getting greener."
          </div>
        </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid rgba(245,240,232,0.06)', paddingTop: 16, marginTop: 16 }}>
              <p style={{ fontFamily: 'DM Sans', fontSize: 9, fontWeight: 300, color: 'rgba(245,240,232,0.18)', lineHeight: 1.6 }}>
                <strong>Disclaimer:</strong> The floor plans are as per the approved plans and specifications as of date. These plans may vary by +/- 3% and are subject to changes. The furniture, accessories, etc. shown in the plans does not form a part of the offering. Customers are requested to visit the site office and apprise themselves of all the necessary details prior to making any purchase decisions. Any decorative item and furniture shown in any unit/private terrace/private area are not a part of our offering. This is just to give an idea of how the unit can be utilized in the best possible way.
              </p>
              <p style={{ fontFamily: 'DM Sans', fontSize: 9, fontWeight: 300, color: 'rgba(245,240,232,0.18)', lineHeight: 1.6 }}>
                Views & photographs used in this brochure are artist’s impression for illustration purpose only. The information, features, offerings and other details herein are only indicative and the developer/owner reserves its right to change any or all of these in its discretion subject to grant of approval from relevant authorities. This printed material does not constitute an offer, an invitation to an offer and/or commitment of any nature between the developer/owner and recipients. The developer’s/owner’s website(s) and other advertising and publicity material include artist’s impression indicating the anticipated appearance of completed development. No warranty is given that the completed development will comply in any degree with such artist’s impression. Costs, designs, facilities and/or specifications may be subject to change without notice.
              </p>
            </div>
      </div>
    </footer>
  );
}

// ── Tweaks Panel ──────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroOverlay": 20,
  "darkNav": true,
  "darkForm": false,
  "accentColor": "#c9a96e"
}/*EDITMODE-END*/;

function TweaksWrapper() {
  const { tweaks, setTweak, TweaksPanel, TweakSection, TweakSlider, TweakToggle, TweakColor } = useTweaks(TWEAK_DEFAULTS);

  return (
    <>
      <TweaksPanel title="Aranya Tweaks">
        <TweakSection label="Hero">
          <TweakSlider label="Overlay Darkness" tweakKey="heroOverlay" min={0} max={60} step={5} />
        </TweakSection>
        <TweakSection label="Navigation">
          <TweakToggle label="Dark Nav on Scroll" tweakKey="darkNav" />
        </TweakSection>
        <TweakSection label="Enquire Section">
          <TweakToggle label="Deep Dark Background" tweakKey="darkForm" />
        </TweakSection>
        <TweakSection label="Brand">
          <TweakColor label="Accent (Gold)" tweakKey="accentColor" />
        </TweakSection>
      </TweaksPanel>
      <Nav tweaks={tweaks} />
      <Hero tweaks={tweaks} />
      <StatsBar />
      <Manifesto />
      <SustainableAtmos />
      <WellnessSection />
      <ClubAranya />
      <HomesSection tweaks={tweaks} />
      <LocationSection />
      <DeveloperSection />
      <EnquireForm tweaks={tweaks} />
      <Footer />
    </>
  );
}

// ── Mount ─────────────────────────────────────────────────────────────────────
const rootEl = document.getElementById('root');
const reactRoot = ReactDOM.createRoot(rootEl);
reactRoot.render(<TweaksWrapper />);
