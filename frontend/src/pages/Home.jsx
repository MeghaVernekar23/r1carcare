import React, { useEffect, useRef, useState } from "react";
import { CarFront, Droplets, Sparkles, ShieldCheck, Waves, CircleDot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

const services = [
  {
    Icon: Droplets,
    eyebrow: "Foam Bay",
    title: "Exterior Foam Wash",
    desc: "Snow-foam pre-soak, pressure rinse, wheel-face cleaning, and hand drying for an instant fresh-wash finish.",
  },
  {
    Icon: Sparkles,
    eyebrow: "Cabin Reset",
    title: "Interior Cleaning",
    desc: "Vacuuming, mat cleanup, dash wipe-down, and glass cleaning to remove dust, crumbs, and daily grime.",
  },
  {
    Icon: Waves,
    eyebrow: "Gloss Boost",
    title: "Wax And Shine",
    desc: "Quick wax protection and gloss enhancement for customers who want more shine after the wash.",
  },
  {
    Icon: ShieldCheck,
    eyebrow: "Add-On Protection",
    title: "Ceramic Top Coat",
    desc: "Hydrophobic protection that helps water bead off and keeps routine wash maintenance easier.",
  },
];

const highlights = [
  { value: "30 min", label: "average wash turnaround" },
  { value: "7 days", label: "open every week for wash slots" },
  { value: "2,000+", label: "cars and bikes cleaned" },
];

const washSignals = [
  { label: "Foam cannon wash", value: "High-pressure pre-soak" },
  { label: "Wheel focus", value: "Tyres, arches, and rims" },
  { label: "Final hand dry", value: "No drip-heavy pickup" },
];

const packages = [
  {
    name: "Quick Wash",
    price: 199,
    blurb: "Fast exterior clean for regular upkeep.",
    points: ["Foam rinse", "Hand dry", "Tyre dressing"],
  },
  {
    name: "Full Wash",
    price: 599,
    blurb: "The most-booked wash package for weekly care.",
    featured: true,
    points: ["Interior vacuum", "Glass cleanup", "Dashboard wipe", "Tyre shine"],
  },
  {
    name: "Wash Plus Detail",
    price: 1499,
    blurb: "Deep clean before trips, events, or resale prep.",
    points: ["Wax finish", "Deep interior clean", "Engine bay cleanup"],
  },
];

const steps = [
  {
    step: "01",
    title: "Choose a slot",
    desc: "Pick the wash package, vehicle type, and the slot that fits your day.",
  },
  {
    step: "02",
    title: "Roll into the wash bay",
    desc: "We confirm the booking, inspect the vehicle quickly, and line it up for the correct wash flow.",
  },
  {
    step: "03",
    title: "Foam, rinse, and finish",
    desc: "The team runs foam wash, wheel cleaning, drying, and any selected interior or wax add-ons.",
  },
  {
    step: "04",
    title: "Collect and drive",
    desc: "Leave with a clean, dry vehicle after the final wipe and finish check.",
  },
];

const testimonials = [
  {
    name: "Arjun K.",
    quote:
      "The foam wash got the road film off properly and the wheels finally looked cleaned instead of just wet.",
  },
  {
    name: "Sneha R.",
    quote:
      "Booking was simple, the slot started on time, and the car came out looking like it had actually been through a wash bay.",
  },
  {
    name: "Vikram P.",
    quote:
      "I came in for a wash and added the protection coat. The shine held up and water still beads off properly.",
  },
];

function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function FadeSection({ children, className = "", delay = 0 }) {
  const [ref, visible] = useFadeIn();

  return (
    <div
      ref={ref}
      className={`home-fade ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-shell">
      <header className="home-nav">
        <button className="home-brand" type="button" onClick={() => navigate("/")}>
          <span className="home-brand-mark">R1</span>
          <span className="home-brand-text">
            <strong>R1 Car Care</strong>
            <small>Foam wash, interior clean, and booking desk</small>
          </span>
        </button>

        <nav className="home-nav-links">
          <a href="#services">Services</a>
          <a href="#packages">Packages</a>
          <a href="#process">Process</a>
          <a href="#reviews">Reviews</a>
        </nav>

        <div className="home-nav-actions">
          <button className="home-btn home-btn-muted" onClick={() => navigate("/login")}>
            Staff Login
          </button>
          <button className="home-btn home-btn-primary" onClick={() => navigate("/booknow")}>
            Book Now
          </button>
        </div>
      </header>

      <main>
        <section className="home-hero">
          <div className="home-hero-grid">
            <div className="home-hero-copy">
              <span className="home-kicker">Mysuru car wash bay and detailing desk</span>
              <h1>Car wash booking built around foam, rinse, wheels, and shine.</h1>
              <p>
                R1 should feel like a real car wash the moment you land here: bright wash-bay
                visuals, fast slot booking, foam-led exterior cleaning, interior reset, and add-on
                protection when you want more than a basic rinse.
              </p>

              <div className="home-hero-actions">
                <button className="home-btn home-btn-primary home-btn-large" onClick={() => navigate("/booknow")}>
                  Reserve a Slot
                </button>
                <a className="home-btn home-btn-outline home-btn-large" href="#packages">
                  Compare Packages
                </a>
              </div>

              <div className="home-highlight-row">
                {highlights.map((item) => (
                  <div key={item.label} className="home-highlight">
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="home-signal-grid">
                {washSignals.map((item) => (
                  <div key={item.label} className="home-signal-card">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="home-hero-stage">
              <div className="home-stage-card home-stage-card-main">
                <div className="home-stage-roofline" aria-hidden="true">
                  <span>R1 WASH BAY</span>
                </div>
                <div className="home-stage-visual" aria-hidden="true">
                  <div className="wash-scene">
                    {/* tunnel frame - left arch */}
                    <div className="wash-arch wash-arch-left" />
                    {/* tunnel frame - right arch */}
                    <div className="wash-arch wash-arch-right" />

                    {/* overhead spray bar */}
                    <div className="wash-spray-bar">
                      <span /><span /><span /><span /><span />
                    </div>

                    {/* left brush */}
                    <div className="wash-brush wash-brush-left">
                      <span /><span /><span /><span /><span /><span />
                    </div>
                    {/* right brush */}
                    <div className="wash-brush wash-brush-right">
                      <span /><span /><span /><span /><span /><span />
                    </div>

                    {/* water curtain */}
                    <div className="wash-curtain">
                      <span /><span /><span /><span /><span /><span /><span /><span />
                    </div>

                    {/* floor wet track */}
                    <div className="wash-floor-track" />

                    {/* bubbles */}
                    <div className="wash-bubbles">
                      <span /><span /><span /><span /><span />
                    </div>

                    {/* THE CAR — Lamborghini-style supercar, faces left */}
                    <div className="wash-car">
                      <svg viewBox="0 0 280 88" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{transform:"scaleX(-1)"}}>
                        <defs>
                          {/* Lamborghini yellow-orange body */}
                          <linearGradient id="scBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%"   stopColor="#ffe066" />
                            <stop offset="20%"  stopColor="#ffb800" />
                            <stop offset="55%"  stopColor="#e07800" />
                            <stop offset="100%" stopColor="#3a1c00" />
                          </linearGradient>
                          {/* top sheen — bright specular highlight */}
                          <linearGradient id="scSheen" x1="0%" y1="0%" x2="10%" y2="100%">
                            <stop offset="0%"   stopColor="rgba(255,255,255,0.55)" />
                            <stop offset="40%"  stopColor="rgba(255,255,255,0.12)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                          </linearGradient>
                          {/* dark carbon-look underside */}
                          <linearGradient id="scUnder" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%"   stopColor="#1a0e00" />
                            <stop offset="100%" stopColor="#0a0600" />
                          </linearGradient>
                          {/* windscreen — dark tinted */}
                          <linearGradient id="scGlass" x1="0%" y1="0%" x2="60%" y2="100%">
                            <stop offset="0%"   stopColor="#a0d4f0" stopOpacity="0.75" />
                            <stop offset="100%" stopColor="#1a3a50" stopOpacity="0.88" />
                          </linearGradient>
                          {/* tyre */}
                          <radialGradient id="scTyre" cx="38%" cy="32%" r="62%">
                            <stop offset="0%"   stopColor="#4a4a4a" />
                            <stop offset="55%"  stopColor="#181818" />
                            <stop offset="100%" stopColor="#060606" />
                          </radialGradient>
                          {/* Y-spoke rim — bright alloy */}
                          <radialGradient id="scRim" cx="42%" cy="38%" r="58%">
                            <stop offset="0%"   stopColor="#f0f0f0" />
                            <stop offset="50%"  stopColor="#a0a0a0" />
                            <stop offset="100%" stopColor="#484848" />
                          </radialGradient>
                          {/* brake caliper orange */}
                          <linearGradient id="scCaliper" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%"   stopColor="#ff6600" />
                            <stop offset="100%" stopColor="#cc4400" />
                          </linearGradient>
                        </defs>

                        {/* ══ GROUND SHADOW ══ */}
                        <ellipse cx="140" cy="86" rx="110" ry="4" fill="rgba(0,0,0,0.35)" />

                        {/* ══ DIFFUSER / UNDERTRAY ══ */}
                        <path d="M 46 72 L 52 78 H 228 L 234 72 Z" fill="url(#scUnder)" />

                        {/* ══ MAIN BODY — ultra-low, wide, angular Lambo silhouette ══
                             Front (left): very long flat bonnet nearly touching ground
                             Cabin: tiny greenhouse set far back
                             Rear (right): squared-off fastback with high tail */}
                        <path d="
                          M 18 68
                          L 20 58 L 22 52 L 30 46
                          L 48 42 L 60 38 L 70 34
                          L 84 26 Q 90 22 98 21
                          L 128 20 Q 136 20 140 22
                          L 152 26 Q 158 28 162 32
                          L 174 36 Q 180 38 184 42
                          L 198 44 L 220 46 L 240 48
                          L 254 50 Q 262 52 264 58
                          L 266 64 L 266 70
                          L 240 72 L 60 72 L 36 70 Z"
                              fill="url(#scBodyGrad)"
                              stroke="rgba(255,230,80,0.25)" strokeWidth="0.8" />

                        {/* ══ TOP SHEEN — wide specular stripe ══ */}
                        <path d="
                          M 70 34 L 84 26 Q 90 22 98 21
                          L 128 20 Q 136 20 140 22
                          L 152 26 Q 157 28 161 31
                          L 172 35 Q 176 37 180 40
                          L 100 43 L 72 40 Z"
                              fill="url(#scSheen)" />

                        {/* ══ ROOFLINE edge ══ */}
                        <path d="M 84 24 Q 90 21 98 20 L 162 20 L 164 22 Q 158 20 98 21 Q 90 22 84 26 Z"
                              fill="rgba(255,255,255,0.3)" />

                        {/* ══ WINDSCREEN — sharply raked ══ */}
                        <path d="M 85 27 Q 91 22 98 21 L 128 21 L 130 43 L 72 43 L 74 37 Q 78 30 85 27 Z"
                              fill="url(#scGlass)"
                              stroke="rgba(160,220,255,0.3)" strokeWidth="0.6" />
                        {/* glare streak on windscreen */}
                        <line x1="88" y1="24" x2="76" y2="40"
                              stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />

                        {/* ══ REAR ENGINE COVER / FLYING BUTTRESS ══ */}
                        <path d="M 132 21 L 162 21 L 164 22 L 174 36 L 184 42 L 170 43 L 162 33 L 152 27 L 132 22 Z"
                              fill="url(#scGlass)"
                              stroke="rgba(160,220,255,0.2)" strokeWidth="0.6" />
                        {/* glare on rear glass */}
                        <line x1="148" y1="23" x2="168" y2="38"
                              stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" strokeLinecap="round" />

                        {/* ══ ENGINE VENT / STRAKES behind cabin ══ */}
                        <line x1="188" y1="42" x2="186" y2="54" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="194" y1="43" x2="192" y2="55" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="200" y1="44" x2="198" y2="56" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="206" y1="45" x2="204" y2="57" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5" strokeLinecap="round" />

                        {/* ══ SIDE INTAKE SCOOP (mid-body) ══ */}
                        <path d="M 188 54 L 216 54 Q 220 54 222 58 L 222 65 L 186 65 Q 184 62 184 58 Q 184 54 188 54 Z"
                              fill="#1a0e00" stroke="rgba(255,180,0,0.3)" strokeWidth="0.8" />
                        {/* intake mesh lines */}
                        <line x1="192" y1="54" x2="192" y2="65" stroke="rgba(255,180,0,0.2)" strokeWidth="0.8" />
                        <line x1="198" y1="54" x2="198" y2="65" stroke="rgba(255,180,0,0.2)" strokeWidth="0.8" />
                        <line x1="204" y1="54" x2="204" y2="65" stroke="rgba(255,180,0,0.2)" strokeWidth="0.8" />
                        <line x1="210" y1="54" x2="210" y2="65" stroke="rgba(255,180,0,0.2)" strokeWidth="0.8" />
                        <line x1="186" y1="58" x2="222" y2="58" stroke="rgba(255,180,0,0.2)" strokeWidth="0.8" />
                        <line x1="185" y1="62" x2="222" y2="62" stroke="rgba(255,180,0,0.2)" strokeWidth="0.8" />

                        {/* ══ DOOR LINE / CREASE ══ */}
                        <path d="M 68 43 Q 120 46 182 43" fill="none"
                              stroke="rgba(0,0,0,0.4)" strokeWidth="1.2" />

                        {/* ══ DOOR HANDLE (flush, supercar style) ══ */}
                        <rect x="108" y="50" width="22" height="2.5" rx="1.25"
                              fill="rgba(255,240,180,0.5)" />

                        {/* ══ SIDE SKIRT — angular / splitter-style ══ */}
                        <path d="M 52 70 L 54 72 L 228 72 L 230 70 Z"
                              fill="#0f0800" />
                        <line x1="52" y1="71" x2="230" y2="71"
                              stroke="rgba(255,180,0,0.3)" strokeWidth="0.8" />

                        {/* ══ FRONT SPLITTER ══ */}
                        <path d="M 14 70 L 20 65 L 46 65 L 46 72 L 18 72 Z"
                              fill="#0f0800" stroke="rgba(255,180,0,0.25)" strokeWidth="0.6" />

                        {/* ══ HEADLIGHT — angular blade-style (Aventador-ish) ══ */}
                        <path d="M 20 52 L 48 46 L 52 56 L 30 62 Q 20 60 20 52 Z"
                              fill="#111" />
                        {/* main beam */}
                        <path d="M 22 53 L 46 48 L 48 54 L 26 59 Q 20 58 22 53 Z"
                              fill="#ffe080" style={{filter:"drop-shadow(0 0 7px #ffe060)"}} />
                        {/* DRL — thin blade strip */}
                        <line x1="22" y1="48" x2="50" y2="43"
                              stroke="#ffffff" strokeWidth="2" strokeLinecap="round"
                              style={{filter:"drop-shadow(0 0 4px #fff8c0)"}} />
                        {/* lower DRL */}
                        <line x1="20" y1="58" x2="46" y2="54"
                              stroke="#ffe080" strokeWidth="1" strokeLinecap="round"
                              opacity="0.6" />

                        {/* ══ TAIL LIGHT — horizontal blade (Huracán-style) ══ */}
                        <path d="M 250 48 L 266 52 L 266 68 L 248 70 Q 242 68 242 62 L 242 52 Q 244 48 250 48 Z"
                              fill="#111" />
                        {/* full-width LED strip */}
                        <line x1="244" y1="50" x2="265" y2="54"
                              stroke="#ff2200" strokeWidth="3" strokeLinecap="round"
                              style={{filter:"drop-shadow(0 0 6px #ff2200)"}} />
                        <line x1="243" y1="56" x2="265" y2="59"
                              stroke="#ff4400" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                        <line x1="243" y1="62" x2="265" y2="64"
                              stroke="#ff3300" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

                        {/* ══ REAR WING ══ */}
                        <rect x="238" y="28" width="40" height="5" rx="2.5"
                              fill="#1a0e00" stroke="rgba(255,180,0,0.4)" strokeWidth="0.8" />
                        {/* wing mount strut */}
                        <rect x="252" y="28" width="3" height="14" rx="1"
                              fill="#0f0800" />
                        <rect x="262" y="28" width="3" height="14" rx="1"
                              fill="#0f0800" />

                        {/* ══ EXHAUST (twin pipes) ══ */}
                        <ellipse cx="252" cy="70" rx="4"  ry="2.5" fill="#111" stroke="#555" strokeWidth="0.8" />
                        <ellipse cx="260" cy="70" rx="4"  ry="2.5" fill="#111" stroke="#555" strokeWidth="0.8" />
                        <ellipse cx="252" cy="70" rx="2.5" ry="1.5" fill="#1a1a1a" />
                        <ellipse cx="260" cy="70" rx="2.5" ry="1.5" fill="#1a1a1a" />

                        {/* ══ FRONT WHEEL ══ */}
                        <g className="wash-wheel">
                          {/* wide low-profile tyre */}
                          <circle cx="68" cy="74" r="14" fill="url(#scTyre)" />
                          <circle cx="68" cy="74" r="14" fill="none"
                                  stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
                          {/* rim face */}
                          <circle cx="68" cy="74" r="10" fill="url(#scRim)" />
                          {/* Y-spoke (5-spoke staggered) */}
                          <line x1="68" y1="64" x2="68" y2="84" stroke="#333" strokeWidth="2.5" />
                          <line x1="58.4" y1="69" x2="77.6" y2="79" stroke="#333" strokeWidth="2.5" />
                          <line x1="58.4" y1="79" x2="77.6" y2="69" stroke="#333" strokeWidth="2.5" />
                          {/* rim inner ring */}
                          <circle cx="68" cy="74" r="5" fill="#909090" stroke="#bbb" strokeWidth="1" />
                          <circle cx="68" cy="74" r="2.5" fill="#e8e8e8" />
                          {/* orange brake caliper */}
                          <path d="M 57 70 Q 55 74 57 78 L 60 78 Q 58 74 60 70 Z"
                                fill="url(#scCaliper)" opacity="0.9" />
                        </g>

                        {/* ══ REAR WHEEL ══ */}
                        <g className="wash-wheel">
                          <circle cx="200" cy="74" r="15" fill="url(#scTyre)" />
                          <circle cx="200" cy="74" r="15" fill="none"
                                  stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
                          {/* rear has wider rim — performance spec */}
                          <circle cx="200" cy="74" r="11" fill="url(#scRim)" />
                          <line x1="200" y1="63" x2="200" y2="85" stroke="#333" strokeWidth="2.5" />
                          <line x1="189.4" y1="69" x2="210.6" y2="79" stroke="#333" strokeWidth="2.5" />
                          <line x1="189.4" y1="79" x2="210.6" y2="69" stroke="#333" strokeWidth="2.5" />
                          <circle cx="200" cy="74" r="5.5" fill="#909090" stroke="#bbb" strokeWidth="1" />
                          <circle cx="200" cy="74" r="2.5" fill="#e8e8e8" />
                          {/* orange brake caliper */}
                          <path d="M 189 70 Q 187 74 189 78 L 192 78 Q 190 74 192 70 Z"
                                fill="url(#scCaliper)" opacity="0.9" />
                        </g>

                        {/* ══ WHEEL ARCHES — flared wide ══ */}
                        {/* front arch */}
                        <path d="M 42 70 Q 40 56 68 56 Q 96 56 96 70 Z"
                              fill="url(#scUnder)" />
                        {/* rear arch */}
                        <path d="M 174 72 Q 172 56 200 56 Q 228 56 228 72 Z"
                              fill="url(#scUnder)" />

                      </svg>

                      {/* foam overlay on car - appears mid-wash */}
                      <div className="wash-car-foam">
                        <span /><span /><span /><span />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="home-stage-topline">Live wash floor status</div>
                <div className="home-stage-metric">
                  <span>Foam + Dry</span>
                  <small>the core wash flow customers actually expect</small>
                </div>
                <div className="home-stage-badges">
                  <span>Foam pre-wash</span>
                  <span>Wheel cleanup</span>
                  <span>Hand dry finish</span>
                  <span>Spot-free glass</span>
                </div>
                <ul className="home-stage-list">
                  <li>Wash-bay styling now leads the page instead of a generic service-brand look</li>
                  <li>Vehicle-based handling supports hatchbacks, sedans, SUVs, bikes, and premium cars</li>
                  <li>Booking plus staff dashboard keeps the bay moving without queue confusion</li>
                </ul>
              </div>

              <div className="home-stage-card home-stage-card-accent">
                <span className="home-stage-chip">Wash line favorite</span>
                <h2>Full Wash</h2>
                <p>Foam cannon, wheel cleanup, vacuum, glass wipe, dashboard reset, and tyre shine.</p>
                <strong>From Rs 599</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="home-marquee">
          <div className="home-marquee-track">
            <span>Foam wash</span>
            <span>Wheel cleaning</span>
            <span>Interior vacuum</span>
            <span>Paint-safe soap</span>
            <span>Express wash slots</span>
            <span>Hand dry finish</span>
          </div>
        </section>

        <section className="home-section home-section-dark" id="services">
          <div className="home-section-head">
            <span className="home-kicker">Services</span>
            <h2>Built around what customers expect from a proper car wash.</h2>
          </div>

          <div className="home-service-grid">
            {services.map((service, index) => (
              <FadeSection key={service.title} className="home-service-card" delay={index * 70}>
                <div className="home-service-icon">
                  <service.Icon size={20} strokeWidth={2} />
                </div>
                <span>{service.eyebrow}</span>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </FadeSection>
            ))}
          </div>
        </section>

        <section className="home-section home-section-split" id="packages">
          <FadeSection className="home-section-copy">
            <span className="home-kicker">Packages</span>
            <h2>Three wash packages that are easy to choose fast.</h2>
            <p>
              The booking flow can handle more combinations, but the homepage should make the first
              decision obvious: quick wash, full wash, or a wash with deeper detailing.
            </p>
            <button className="home-btn home-btn-primary" onClick={() => navigate("/booknow")}>
              Start Booking
            </button>
          </FadeSection>

          <div className="home-package-stack">
            {packages.map((pkg, index) => (
              <FadeSection
                key={pkg.name}
                className={`home-package-card ${pkg.featured ? "is-featured" : ""}`}
                delay={index * 90}
              >
                <div className="home-package-header">
                  <div>
                    <h3>{pkg.name}</h3>
                    <p>{pkg.blurb}</p>
                  </div>
                  <strong>Rs {pkg.price}</strong>
                </div>
                <div className="home-package-points">
                  {pkg.points.map((point) => (
                    <span key={point}>{point}</span>
                  ))}
                </div>
              </FadeSection>
            ))}
          </div>
        </section>

        <section className="home-section home-process" id="process">
          <div className="home-section-head">
            <span className="home-kicker">Process</span>
            <h2>Fast to book, clear in the bay, consistent at pickup.</h2>
          </div>

          <div className="home-process-grid">
            {steps.map((item, index) => (
              <FadeSection key={item.step} className="home-process-card" delay={index * 80}>
                <strong>{item.step}</strong>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </FadeSection>
            ))}
          </div>
        </section>

        <section className="home-section home-proof">
          <FadeSection className="home-proof-panel">
            <span className="home-kicker">Why people return</span>
            <h2>A homepage that reads like a working wash bay, not a generic service template.</h2>
            <p>
              The page now pushes the wash-first story up front: bay lighting, water tones, foam,
              wheel care, drying, quick slots, and package clarity instead of drifting into a luxury
              salon aesthetic.
            </p>
          </FadeSection>

          <FadeSection className="home-proof-grid" delay={80}>
            <div>
              <CircleDot size={18} strokeWidth={2.2} />
              <strong>Express-friendly</strong>
              <p>Walk-ins still work, but booked customers lock in the wash slot they actually want.</p>
            </div>
            <div>
              <CarFront size={18} strokeWidth={2.2} />
              <strong>Vehicle-based wash flow</strong>
              <p>Bike, hatchback, sedan, and SUV cleaning can map cleanly to the available wash tiers.</p>
            </div>
            <div>
              <Droplets size={18} strokeWidth={2.2} />
              <strong>Booking-led operation</strong>
              <p>The staff login remains visible, but the main journey clearly prioritizes wash booking.</p>
            </div>
          </FadeSection>
        </section>

        <section className="home-section home-reviews" id="reviews">
          <div className="home-section-head">
            <span className="home-kicker">Reviews</span>
            <h2>Customers remember clean wheels, dry panels, and on-time slots.</h2>
          </div>

          <div className="home-review-grid">
            {testimonials.map((item, index) => (
              <FadeSection key={item.name} className="home-review-card" delay={index * 70}>
                <p>"{item.quote}"</p>
                <strong>{item.name}</strong>
              </FadeSection>
            ))}
          </div>
        </section>

        <section className="home-cta">
          <div>
            <span className="home-kicker">Ready to book</span>
            <h2>Reserve your wash in under two minutes.</h2>
            <p>
              Call for quick questions or go straight to the booking flow for time-slot availability.
            </p>
          </div>

          <div className="home-cta-actions">
            <a className="home-btn home-btn-outline-dark" href="tel:+919876543210">
              Call +91 98765 43210
            </a>
            <button className="home-btn home-btn-primary" onClick={() => navigate("/booknow")}>
              Book Online
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
