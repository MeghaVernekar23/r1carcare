import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

/* ── SVG icon components ─────────────────────────────── */
const IconWash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 16.5c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V10l-2-5H9L7 10v6.5z"/>
    <path d="M7 12h10"/><path d="M10 5l-.5-2"/><path d="M14 5l.5-2"/>
    <path d="M4 19c0 1 .5 2 1.5 2s1.5-1 1.5-2-.5-2-1.5-2S4 18 4 19z"/>
    <path d="M17 19c0 1 .5 2 1.5 2s1.5-1 1.5-2-.5-2-1.5-2-1.5 1-1.5 2z"/>
  </svg>
);
const IconInterior = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3"/>
    <path d="M3 9h18"/><path d="M9 21V9"/><path d="M15 15h2"/><path d="M15 12h2"/>
  </svg>
);
const IconPolish = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
  </svg>
);
const IconCeramic = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconBike = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/>
    <path d="M15 6h-5l-2 5.5h9.5L15 6z"/><path d="M5.5 17.5L9 11.5"/><path d="M18.5 17.5L15 6"/>
    <path d="M11 6V4h3"/>
  </svg>
);
const IconSUV = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 17h20v2a1 1 0 01-1 1H3a1 1 0 01-1-1v-2z"/>
    <path d="M2 17l2-7h16l2 7"/>
    <path d="M6 10l2-4h8l2 4"/>
    <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
  </svg>
);

const services = [
  { Icon: IconWash,     title: "Exterior Wash",      desc: "Full exterior rinse, hand dry, and tyre clean for a spotless finish every time." },
  { Icon: IconInterior, title: "Interior Detailing",  desc: "Deep vacuum, dashboard wipe-down, and upholstery care for a fresh cabin." },
  { Icon: IconPolish,   title: "Wax & Polish",        desc: "Paint protection with premium wax and machine polish for a showroom shine." },
  { Icon: IconCeramic,  title: "Ceramic Coating",     desc: "Long-lasting ceramic nano-coating for superior paint protection and hydrophobics." },
  { Icon: IconBike,     title: "Bike Wash",           desc: "Complete two-wheeler wash, degreasing, and tyre dressing service." },
  { Icon: IconSUV,      title: "SUV & Luxury",        desc: "Specialised packages for SUVs, MPVs, and luxury vehicles with extra care." },
];

const highlights = [
  { num: "2000+", label: "Cars Washed" },
  { num: "500+",  label: "Happy Customers" },
  { num: "6",     label: "Wash Packages" },
  { num: "4.9",   label: "Average Rating" },
];

const packages = [
  { name: "Bike Wash",        price: 150,  desc: "Complete 2-wheeler wash & clean",          featured: false },
  { name: "Body Wash",        price: 350,  desc: "Basic exterior body wash",                 featured: false },
  { name: "Hatchback Wash",   price: 500,  desc: "Body wash for hatchback vehicles",         featured: false },
  { name: "Sedan Wash",       price: 550,  desc: "Body wash for sedan vehicles",             featured: true, badge: "Popular" },
  { name: "Compact SUV Wash", price: 550,  desc: "Body wash for compact SUV vehicles",       featured: false },
  { name: "SUV Luxury Wash",  price: 600,  desc: "Body wash for SUV and luxury vehicles",    featured: false },
];

const steps = [
  { num: "01", title: "Book Online",           desc: "Choose your package, vehicle type, and preferred date & time slot." },
  { num: "02", title: "Drop Your Vehicle",     desc: "Arrive at our facility — our team will do a pre-wash inspection." },
  { num: "03", title: "We Do the Work",        desc: "Expert technicians work through your package with professional equipment." },
  { num: "04", title: "Drive Away Clean",      desc: "Collect your sparkling vehicle and enjoy the ride!" },
];

const testimonials = [
  { name: "Arjun K.",  initial: "A", text: "My car looked brand new after the Full Detail package. The attention to detail is exceptional. Will definitely be a regular customer!" },
  { name: "Sneha R.",  initial: "S", text: "Booked online in 2 minutes, dropped my car, and it was ready in an hour. The Premium Wash is totally worth it." },
  { name: "Vikram P.", initial: "V", text: "Got the ceramic coating done. Six months on, the car still repels water like day one. Outstanding work by the R1 team." },
];

/* ── Fade-in on scroll hook ─────────────────────────────── */
function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function FadeSection({ children, className = "", style = {}, delay = 0 }) {
  const [ref, visible] = useFadeIn();
  return (
    <div
      ref={ref}
      className={`fade-section${visible ? " fade-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}

/* ── Component ──────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="cc-root">

      {/* ── NAVBAR ── */}
      <header className="cc-nav">
        <div className="cc-nav-brand">
          <div className="cc-nav-logo">
            <svg viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#1d4ed8"/>
              <path d="M8 22l3-8h10l3 8" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M8 22h16" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="11" cy="22" r="2" fill="#fff"/>
              <circle cx="21" cy="22" r="2" fill="#fff"/>
              <path d="M11 14l1.5-4h7l1.5 4" stroke="#93c5fd" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <span><span className="brand-r1">R1</span> Car Care</span>
        </div>
        <nav className="cc-nav-links">
          <a href="#services">Services</a>
          <a href="#packages">Packages</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="cc-nav-actions">
          <button className="cc-btn-outline" onClick={() => navigate("/booknow")}>Book Now</button>
          <button className="cc-btn-primary" onClick={() => navigate("/login")}>Staff Login</button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="cc-hero">
        <div className="cc-hero-bg">
          <div className="cc-hero-blob cc-hero-blob-1" />
          <div className="cc-hero-blob cc-hero-blob-2" />
          <div className="cc-hero-blob cc-hero-blob-3" />
        </div>
        <div className="cc-hero-inner">
          <div className="cc-hero-text hero-animate">
            <div className="cc-hero-badges">
              <span className="cc-badge cc-badge-blue">Mysuru's Premier Car Care</span>
              <span className="cc-badge cc-badge-outline">Packages from ₹150</span>
            </div>
            <h1>
              Your Car Deserves<br />
              <span className="cc-gradient-text">The Best Clean</span>
            </h1>
            <p className="cc-hero-sub">
              Professional car wash and detailing services with premium equipment.
              From a quick rinse to full ceramic coating — we keep your ride immaculate.
            </p>
            <div className="cc-hero-btns">
              <button className="cc-btn-hero-primary" onClick={() => navigate("/booknow")}>
                Book Your Slot
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <a href="#packages" className="cc-btn-hero-ghost">View Packages</a>
            </div>
          </div>

          <div className="cc-hero-card hero-animate hero-animate-delay">
            <div className="cc-hero-card-header">
              <div className="cc-hero-card-dot cc-dot-green" />
              <div className="cc-hero-card-dot cc-dot-yellow" />
              <div className="cc-hero-card-dot cc-dot-red" />
              <span className="cc-hero-card-title">Premium Car Care Center</span>
            </div>
            <ul className="cc-hero-card-list">
              {["All vehicle types accepted","Professional equipment","Trained technicians","Flexible time slots","Express wash available"].map(item => (
                <li key={item}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  {item}
                </li>
              ))}
            </ul>
            <div className="cc-hero-card-divider" />
            <div className="cc-hero-card-price">
              Starting at <strong>₹150</strong> · Bike Wash
            </div>
            <button className="cc-btn-primary cc-btn-block" onClick={() => navigate("/booknow")}>
              Check Availability
            </button>
          </div>
        </div>

        <div className="cc-hero-scroll-hint">
          <div className="cc-scroll-mouse"><div className="cc-scroll-dot" /></div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="cc-stats">
        {highlights.map((h, i) => (
          <FadeSection key={h.label} className="cc-stat" delay={i * 80}>
            <span className="cc-stat-num">{h.num}</span>
            <span className="cc-stat-label">{h.label}</span>
          </FadeSection>
        ))}
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="cc-section">
        <div className="cc-container">
          <FadeSection className="cc-section-head">
            <span className="cc-label-tag">What We Offer</span>
            <h2>Complete Car Care, <span className="cc-gradient-text">One Stop</span></h2>
            <p>From a quick exterior wash to a full ceramic coat — we do it all.</p>
          </FadeSection>
          <div className="cc-services-grid">
            {services.map(({ Icon, title, desc }, i) => (
              <FadeSection key={title} className="cc-service-card" delay={i * 60}>
                <div className="cc-service-icon-wrap">
                  <Icon />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGES ── */}
      <section id="packages" className="cc-packages-section">
        <div className="cc-container">
          <FadeSection className="cc-section-head">
            <span className="cc-label-tag">Pricing</span>
            <h2>Pick Your <span className="cc-gradient-text">Package</span></h2>
            <p>Transparent pricing, no hidden charges.</p>
          </FadeSection>
          <div className="cc-packages-grid">
            {packages.map((p, i) => (
              <FadeSection key={p.name} className={`cc-pkg-card${p.featured ? " featured" : ""}`} delay={i * 60}>
                {p.badge && <div className="cc-pkg-badge">{p.badge}</div>}
                <div className="cc-pkg-name">{p.name}</div>
                <div className="cc-pkg-price">₹{p.price} <span>/ car</span></div>
                <div className="cc-pkg-desc">{p.desc}</div>
                <button
                  className={`cc-pkg-btn${p.featured ? " cc-pkg-btn-featured" : ""}`}
                  onClick={() => navigate("/booknow")}
                >
                  Book This
                </button>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="cc-section" id="how">
        <div className="cc-container">
          <FadeSection className="cc-section-head">
            <span className="cc-label-tag">Process</span>
            <h2>How It <span className="cc-gradient-text">Works</span></h2>
            <p>Four simple steps to a spotless car.</p>
          </FadeSection>
          <div className="cc-steps">
            {steps.map((s, i) => (
              <FadeSection key={s.num} className="cc-step" delay={i * 80}>
                <div className="cc-step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < steps.length - 1 && <div className="cc-step-arrow" />}
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery" className="cc-gallery-section">
        <div className="cc-container">
          <FadeSection className="cc-section-head">
            <span className="cc-label-tag">Gallery</span>
            <h2>Freshly Washed, <span className="cc-gradient-text">Every Time</span></h2>
            <p>Real results from our detailing centre.</p>
          </FadeSection>
          <FadeSection className="cc-gallery-grid">
            <div className="cc-gallery-item cc-gallery-tall">
              <img src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=85" alt="Full detail" loading="lazy" />
              <div className="cc-gallery-overlay"><span>Full Detail</span></div>
            </div>
            <div className="cc-gallery-item">
              <img src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&q=85" alt="Interior detailing" loading="lazy" />
              <div className="cc-gallery-overlay"><span>Interior Detail</span></div>
            </div>
            <div className="cc-gallery-item">
              <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=85" alt="Shiny car" loading="lazy" />
              <div className="cc-gallery-overlay"><span>Ceramic Coat</span></div>
            </div>
            <div className="cc-gallery-item">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=85" alt="Wax polish" loading="lazy" />
              <div className="cc-gallery-overlay"><span>Wax Polish</span></div>
            </div>
            <div className="cc-gallery-item">
              <img src="https://images.unsplash.com/photo-1617469767886-b3f0e9b4bfc4?w=600&q=85" alt="Engine bay" loading="lazy" />
              <div className="cc-gallery-overlay"><span>Engine Bay</span></div>
            </div>
          </FadeSection>
          <div className="cc-gallery-cta">
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="cc-btn-outline-dark">
              See More on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="cc-section cc-testi-section" id="testimonials">
        <div className="cc-container">
          <FadeSection className="cc-section-head">
            <span className="cc-label-tag">Reviews</span>
            <h2>Trusted by <span className="cc-gradient-text">Car Enthusiasts</span></h2>
            <p>Hear from our happy customers.</p>
          </FadeSection>
          <div className="cc-testi-grid">
            {testimonials.map((t, i) => (
              <FadeSection key={t.name} className="cc-testi-card" delay={i * 80}>
                <div className="cc-testi-stars">★★★★★</div>
                <p className="cc-testi-text">"{t.text}"</p>
                <div className="cc-testi-author">
                  <div className="cc-testi-avatar">{t.initial}</div>
                  <span>{t.name}</span>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cc-cta" id="contact">
        <div className="cc-cta-bg">
          <div className="cc-cta-blob cc-cta-blob-1" />
          <div className="cc-cta-blob cc-cta-blob-2" />
        </div>
        <FadeSection className="cc-cta-inner">
          <h2>Ready for a Gleaming Car?</h2>
          <p>Book your slot online in under 2 minutes. Walk-ins welcome — but online booking guarantees your preferred time.</p>
          <div className="cc-cta-btns">
            <a href="tel:+919876543210" className="cc-btn-hero-primary" style={{ textDecoration: "none" }}>
              Call Us — +91 98765 43210
            </a>
            <button className="cc-btn-hero-ghost" onClick={() => navigate("/booknow")}>Book Now</button>
          </div>
          <p className="cc-cta-address">
            12, Industrial Layout, Near Ring Road, Vijayanagar, Mysuru – 570 017
          </p>
        </FadeSection>
      </section>

      {/* ── FOOTER ── */}
      <footer className="cc-footer">
        <div className="cc-footer-brand"><span className="brand-r1">R1</span> Car Care</div>
        <div className="cc-footer-info">
          <p>12, Industrial Layout, Near Ring Road, Vijayanagar, Mysuru – 570 017</p>
          <p><a href="tel:+919876543210">+91 98765 43210</a></p>
        </div>
        <p className="cc-footer-copy">© {new Date().getFullYear()} R1 Car Care · All rights reserved.</p>
      </footer>

    </div>
  );
}
