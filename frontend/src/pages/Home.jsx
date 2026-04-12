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

                    {/* THE CAR */}
                    <div className="wash-car">
                      <svg viewBox="0 0 200 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <defs>
                          <linearGradient id="wBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%"   stopColor="#e8c49a" />
                            <stop offset="40%"  stopColor="#c47a3a" />
                            <stop offset="100%" stopColor="#5a2a08" />
                          </linearGradient>
                          <linearGradient id="wGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%"   stopColor="#d0f0ff" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#5aaac8" stopOpacity="0.7" />
                          </linearGradient>
                          <radialGradient id="wWheelGrad" cx="50%" cy="40%" r="60%">
                            <stop offset="0%"   stopColor="#666" />
                            <stop offset="100%" stopColor="#111" />
                          </radialGradient>
                        </defs>
                        {/* shadow */}
                        <ellipse cx="100" cy="83" rx="72" ry="6" fill="rgba(0,0,0,0.25)" />
                        {/* body */}
                        <path d="M18 64 L24 50 C27 43 36 37 48 35 L90 29 C98 28 104 24 112 18 L128 8 C133 5 139 4 145 4 H168 C178 4 185 11 188 22 L191 38 C192 42 193 47 193 52 V61 C193 67 188 71 182 71 H173 C169 71 165 68 163 64 L157 54 H67 L59 64 C57 68 53 71 48 71 H32 C24 71 16 67 18 64 Z"
                              fill="url(#wBodyGrad)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                        {/* glass */}
                        <path d="M72 34 L92 28 C100 26 106 22 113 17 L127 9 H158 C165 9 170 15 172 24 L174 37 H72 Z"
                              fill="url(#wGlassGrad)" stroke="rgba(200,240,255,0.3)" strokeWidth="1" />
                        {/* pillar line */}
                        <line x1="114" y1="37" x2="114" y2="54" stroke="rgba(200,240,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
                        {/* headlight */}
                        <rect x="186" y="46" width="7" height="8" rx="3" fill="#ffd060" style={{filter:"drop-shadow(0 0 5px #ffd060)"}} />
                        {/* tail light */}
                        <rect x="16" y="49" width="8" height="6" rx="3" fill="#ff4444" style={{filter:"drop-shadow(0 0 4px #ff4444)"}} />
                        {/* wheels */}
                        <circle cx="60" cy="70" r="16" fill="url(#wWheelGrad)" stroke="#222" strokeWidth="3" className="wash-wheel" />
                        <circle cx="60" cy="70" r="6"  fill="#888" stroke="#ccc" strokeWidth="2" className="wash-wheel-hub" />
                        <circle cx="152" cy="70" r="16" fill="url(#wWheelGrad)" stroke="#222" strokeWidth="3" className="wash-wheel" />
                        <circle cx="152" cy="70" r="6"  fill="#888" stroke="#ccc" strokeWidth="2" className="wash-wheel-hub" />
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
