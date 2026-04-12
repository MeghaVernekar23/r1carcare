import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

const services = [
  {
    eyebrow: "Foam Bay",
    title: "Exterior Foam Wash",
    desc: "Snow-foam pre-soak, pressure rinse, wheel-face cleaning, and hand drying for an instant fresh-wash finish.",
  },
  {
    eyebrow: "Cabin Reset",
    title: "Interior Cleaning",
    desc: "Vacuuming, mat cleanup, dash wipe-down, and glass cleaning to remove dust, crumbs, and daily grime.",
  },
  {
    eyebrow: "Gloss Boost",
    title: "Wax And Shine",
    desc: "Quick wax protection and gloss enhancement for customers who want more shine after the wash.",
  },
  {
    eyebrow: "Add-On Protection",
    title: "Ceramic Top Coat",
    desc: "Hydrophobic protection that helps water bead off and keeps routine wash maintenance easier.",
  },
];

const highlights = [
  { value: "30 min", label: "express wash turnaround" },
  { value: "4.9/5", label: "local customer rating" },
  { value: "2,000+", label: "cars and bikes cleaned" },
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
    desc: "Pick your wash package, vehicle type, and preferred time slot.",
  },
  {
    step: "02",
    title: "Arrive at the bay",
    desc: "We confirm the booking, inspect the car quickly, and queue the correct wash workflow.",
  },
  {
    step: "03",
    title: "Wash and finish",
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
      "The foam wash and wheel cleaning made the car look fresh without keeping me waiting half the day.",
  },
  {
    name: "Sneha R.",
    quote:
      "Booking was simple, the slot started on time, and the interior cleanup made the cabin feel properly reset.",
  },
  {
    name: "Vikram P.",
    quote:
      "I came in for a wash and added the protection coat. Water still beads off properly after weeks.",
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
              <span className="home-kicker">Mysuru foam wash and car cleaning</span>
              <h1>Fast car wash service with a cleaner, sharper finish.</h1>
              <p>
                R1 is built around repeatable car wash workflows: foam pre-soak, wheel cleaning,
                hand drying, interior reset, and optional shine protection with quick online booking.
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
            </div>

            <div className="home-hero-stage">
              <div className="home-stage-card home-stage-card-main">
                <div className="home-stage-topline">Today in the wash bay</div>
                <div className="home-stage-metric">
                  <span>14</span>
                  <small>confirmed wash bookings</small>
                </div>
                <div className="home-stage-badges">
                  <span>Foam pre-wash</span>
                  <span>Wheel cleanup</span>
                  <span>Hand dry finish</span>
                </div>
                <ul className="home-stage-list">
                  <li>Exterior and interior stations separated for faster wash turnaround</li>
                  <li>Dedicated wash handling for hatchbacks, SUVs, bikes, and premium cars</li>
                  <li>Online booking plus staff dashboard keeps the queue under control</li>
                </ul>
              </div>

              <div className="home-stage-card home-stage-card-accent">
                <span className="home-stage-chip">Most booked</span>
                <h2>Full Wash</h2>
                <p>Foam wash, interior vacuum, glass cleanup, dashboard wipe, and tyre shine.</p>
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
            <h2>A local car wash homepage that actually feels like a car wash brand.</h2>
            <p>
              The page now pushes the wash-first story up front: bays, foam, wheels, drying, quick
              slots, and package clarity instead of reading like a generic premium service template.
            </p>
          </FadeSection>

          <FadeSection className="home-proof-grid" delay={80}>
            <div>
              <strong>Express-friendly</strong>
              <p>Walk-ins still work, but booked customers lock in the wash slot they actually want.</p>
            </div>
            <div>
              <strong>Vehicle-based wash flow</strong>
              <p>Bike, hatchback, sedan, and SUV cleaning can map cleanly to the available wash tiers.</p>
            </div>
            <div>
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
