import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/APIrequest";
import { BASE_URL } from "../services/utils";
import "../css/BookNow.css";

const TIMES = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
const ANNUAL = { washes: 10, price: 4000, validity: "12 months" };

function ActiveCardView({ card }) {
  const pct = Math.round((card.washes_used / card.total_washes) * 100);
  return (
    <div className="bn-active-card">
      {/* Header */}
      <div className="bn-ac-header">
        <div>
          <div className="bn-ac-title">Annual Wash Package</div>
          <div className="bn-ac-sub">Valid till {card.expiry_date} &nbsp;·&nbsp; ₹{card.price_paid} paid</div>
        </div>
        <span className={`bn-ac-badge bn-ac-badge--${card.status}`}>
          {card.status === "active" ? "ACTIVE" : card.status === "completed" ? "COMPLETED" : "EXPIRED"}
        </span>
      </div>

      {/* Wash counter */}
      <div className="bn-ac-counter-row">
        <div className="bn-ac-counter">
          <div className="bn-ac-num">{card.washes_used}</div>
          <div className="bn-ac-num-label">used</div>
        </div>
        <div className="bn-ac-divider" />
        <div className="bn-ac-counter bn-ac-counter--highlight">
          <div className="bn-ac-num">{card.washes_remaining}</div>
          <div className="bn-ac-num-label">remaining</div>
        </div>
        <div className="bn-ac-divider" />
        <div className="bn-ac-counter">
          <div className="bn-ac-num">{card.total_washes}</div>
          <div className="bn-ac-num-label">total</div>
        </div>
      </div>

      {/* Stamp dots — green = used, outline = remaining */}
      <div className="bn-ac-dots">
        {Array.from({ length: card.total_washes }, (_, i) => (
          <div key={i} className={`bn-acdot${i < card.washes_used ? " bn-acdot--used" : ""}`}>
            {i < card.washes_used && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
            {i >= card.washes_used && (
              <span className="bn-acdot-num">{i + 1}</span>
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bn-ac-bar-wrap">
        <div className="bn-ac-bar" style={{ width: `${pct}%` }} />
      </div>
      <div className="bn-ac-bar-labels">
        <span>0</span>
        <span>{card.total_washes} washes</span>
      </div>

      {/* Perks */}
      {card.free_wash_earned && !card.free_wash_used && (
        <div className="bn-ac-alert bn-ac-alert--free">
          🎉 All {card.total_washes} washes completed — you have 1 FREE wash! Mention it at the counter.
        </div>
      )}
      {card.birthday_box_discount && (
        <div className="bn-ac-alert bn-ac-alert--birthday">
          🎂 50% off at BirthdayBox — show this at the counter
        </div>
      )}
    </div>
  );
}

export default function BookNow() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [bookingType, setBookingType] = useState("single");
  const [form, setForm] = useState({
    phone: "", name: "",
    package_id: "", vehicle_type_id: "", vehicle_number: "",
    date: "", time: "", payment_mode: "",
  });
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [stampCard, setStampCard] = useState(null);
  const [looking, setLooking] = useState(false);

  useEffect(() => {
    apiRequest({ url: `${BASE_URL}/bookings/packages` }).then(setPackages).catch(() => {});
    apiRequest({ url: `${BASE_URL}/bookings/vehicle-types` }).then(setVehicleTypes).catch(() => {});
  }, []);

  const lookupCustomer = async (e) => {
    const phone = (e?.target?.value ?? form.phone).trim();
    if (phone.length < 7) return;

    setLooking(true);
    setStampCard(null);
    setCustomerId(null);

    // 1. Customer lookup — stop if not found
    try {
      const c = await apiRequest({ url: `${BASE_URL}/customers/details/${phone}` });
      setForm(f => ({ ...f, name: c.name }));
      setCustomerId(c.customer_id);
    } catch {
      setLooking(false);
      return;
    }

    // 2. Stamp card — auto-switch tab if active card found
    try {
      const sc = await apiRequest({ url: `${BASE_URL}/stamp-cards/by-phone/${phone}` });
      if (sc && (sc.status === "active" || (sc.status === "completed" && !sc.free_wash_used))) {
        setStampCard(sc);
        setBookingType("annual"); // ← auto-select the Annual Package tab
      } else {
        setStampCard(null);
      }
    } catch {
      setStampCard(null);
    }

    // 3. Pre-fill last vehicle details
    try {
      const v = await apiRequest({ url: `${BASE_URL}/customers/vehicle/${phone}` });
      if (v?.vehicle_type_id) {
        setForm(f => ({
          ...f,
          vehicle_type_id: v.vehicle_type_id,
          vehicle_number: v.vehicle_number ?? f.vehicle_number,
        }));
      }
    } catch {}

    setLooking(false);
  };

  const hasActiveCard = !!stampCard;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);

    // Authenticate as customer user
    try {
      const loginData = new URLSearchParams();
      loginData.append("username", "customer");
      loginData.append("password", "customer@r1carcare");
      const tokenData = await apiRequest({
        url: `${BASE_URL}/users/login`,
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: loginData.toString(),
      });
      localStorage.setItem("access_token", tokenData.access_token);
    } catch {
      setErr("Booking service unavailable. Please call us directly.");
      return;
    }

    // Ensure customer exists (idempotent — won't duplicate on same phone)
    let cId = customerId;
    if (!cId) {
      try {
        const res = await apiRequest({
          url: `${BASE_URL}/customers/submit`, method: "POST",
          data: { name: form.name || "Online Customer", phone_number: form.phone.trim() },
        });
        cId = res.customer_id;
      } catch (ex) {
        setErr("Could not register customer: " + ex.message);
        localStorage.removeItem("access_token");
        return;
      }
    }

    const isAnnualNew  = !hasActiveCard && bookingType === "annual";
    const isAnnualCard =  hasActiveCard && bookingType === "annual";

    try {
      let notes = null;
      let cardIdForWash = null;
      let isFreeWash = false;

      // ── NEW annual package: create stamp card + record wash #1 ──
      if (isAnnualNew) {
        const cardRes = await apiRequest({
          url: `${BASE_URL}/stamp-cards/purchase`, method: "POST",
          data: { customer_id: cId, total_washes: ANNUAL.washes, price_paid: ANNUAL.price },
        });
        cardIdForWash = cardRes.card_id;
        const washRes = await apiRequest({
          url: `${BASE_URL}/stamp-cards/${cardIdForWash}/record-wash`, method: "POST",
        });
        notes = `Annual Package activated — wash 1 of ${ANNUAL.washes} recorded · ${washRes.washes_remaining} remaining`;
      }

      // ── RETURNING customer with active card: deduct one wash ──
      if (isAnnualCard) {
        if (stampCard.free_wash_earned && !stampCard.free_wash_used) {
          // Redeem the free wash
          await apiRequest({
            url: `${BASE_URL}/stamp-cards/${stampCard.card_id}/use-free-wash`, method: "POST",
          });
          notes = "Annual Package — FREE WASH redeemed";
          isFreeWash = true;
        } else {
          const washRes = await apiRequest({
            url: `${BASE_URL}/stamp-cards/${stampCard.card_id}/record-wash`, method: "POST",
          });
          notes = `Annual Package — wash ${washRes.washes_used} of ${ANNUAL.washes} · ${washRes.washes_remaining} remaining`;
          if (washRes.free_wash_earned) notes += " · 🎉 Free wash earned!";
        }
      }

      // ── Create the booking entry ──
      const pkg = packages.find(p => p.package_id === form.package_id);
      await apiRequest({
        url: `${BASE_URL}/bookings/submit`, method: "POST",
        data: {
          customer_id: cId,
          package_id: (isAnnualNew || isAnnualCard) ? null : form.package_id,
          vehicle_type_id: form.vehicle_type_id,
          vehicle_number: form.vehicle_number,
          appointment_date: form.date,
          appointment_time: form.time,
          status: "pending",
          payment_mode: form.payment_mode || null,
          payment_total: isAnnualNew ? ANNUAL.price : (isAnnualCard ? 0 : (pkg ? pkg.price : null)),
          payment_paid: isAnnualNew ? ANNUAL.price : 0,
          notes,
        },
      });

      setMsg({ phone: form.phone.trim(), isAnnualNew, isAnnualCard, isFreeWash });
      localStorage.removeItem("access_token");
    } catch (ex) {
      setErr(ex.message);
      localStorage.removeItem("access_token");
    }
  };

  if (msg) {
    return (
      <div className="bn-page">
        <div className="bn-success">
          <div className="bn-success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2>
            {msg.isFreeWash ? "Free Wash Booked!" : msg.isAnnualCard ? "Wash Booked!" : msg.isAnnualNew ? "Annual Package Activated!" : "Appointment Booked!"}
          </h2>
          <p>
            {msg.isFreeWash
              ? <>Your free wash has been redeemed and your slot is reserved. We'll confirm via call to <strong>{msg.phone}</strong>.</>
              : msg.isAnnualCard
              ? <>One wash has been deducted from your annual package and your slot is reserved. We'll confirm via call to <strong>{msg.phone}</strong>.</>
              : msg.isAnnualNew
              ? <>Your annual package is now active and wash #1 has been recorded. We'll confirm your slot via call to <strong>{msg.phone}</strong>.</>
              : <>Your appointment is scheduled. We'll confirm via call to <strong>{msg.phone}</strong>.</>
            }
          </p>
          <button className="bn-btn-primary" onClick={() => navigate("/")}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bn-page">
      <div className="bn-nav">
        <div className="bn-brand"><span className="brand-r1">R1</span> Car Care</div>
        <button className="bn-back" onClick={() => navigate("/")}>← Home</button>
      </div>

      <div className="bn-card">
        <div className="bn-card-header">
          <h1>Book Your Car Wash</h1>
          <p>Fill in the details below to schedule your appointment.</p>
        </div>

        {err && <div className="bn-alert-error">{err}</div>}

        <form onSubmit={handleSubmit}>

          {/* ── Contact ── */}
          <div className="bn-row">
            <div className="bn-field">
              <label>Phone Number *</label>
              <div className="bn-input-wrap">
                <input required value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  onBlur={lookupCustomer}
                  placeholder="Mobile number" />
                {looking
                  ? <span className="bn-looking">Looking up…</span>
                  : form.phone.trim().length >= 7 && (
                    <button type="button" className="bn-lookup-btn" onClick={lookupCustomer}>
                      Check
                    </button>
                  )
                }
              </div>
            </div>
            <div className="bn-field">
              <label>Your Name *</label>
              <input required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Full name" />
            </div>
          </div>

          {/* ── Booking type toggle — always visible ── */}
          <div className="bn-type-toggle">
            <button type="button"
              className={`bn-type-btn${bookingType === "single" ? " bn-type-btn--active" : ""}`}
              onClick={() => setBookingType("single")}>
              Single Wash
            </button>
            <button type="button"
              className={`bn-type-btn${bookingType === "annual" ? " bn-type-btn--active" : ""}`}
              onClick={() => setBookingType("annual")}>
              Annual Package
              {hasActiveCard
                ? <span className="bn-type-badge bn-type-badge--card">Your Card</span>
                : <span className="bn-type-badge">Save more</span>
              }
            </button>
          </div>

          {/* ── Annual tab: existing card ── */}
          {bookingType === "annual" && hasActiveCard && (
            <ActiveCardView card={stampCard} />
          )}

          {/* ── Annual tab: new purchase ── */}
          {bookingType === "annual" && !hasActiveCard && (
            <div className="bn-annual-card">
              <div className="bn-annual-top">
                <div>
                  <div className="bn-annual-title">Annual Wash Package</div>
                  <div className="bn-annual-sub">Pre-paid · {ANNUAL.validity} validity</div>
                </div>
                <div className="bn-annual-price">₹{ANNUAL.price}</div>
              </div>
              <div className="bn-annual-stamps">
                {Array.from({ length: ANNUAL.washes }, (_, i) => (
                  <div key={i} className="bn-annual-dot">
                    <span className="bn-annual-dot-num">{i + 1}</span>
                  </div>
                ))}
              </div>
              <div className="bn-annual-perks">
                <span className="bn-annual-perk">✓ 1 free wash after {ANNUAL.washes} washes</span>
                <span className="bn-annual-perk">✓ 50% off at BirthdayBox</span>
              </div>
              <p className="bn-annual-note">
                Book your first slot below. Bring ₹{ANNUAL.price} on the day — staff will activate your card.
              </p>
            </div>
          )}

          {/* ── Single wash: package selector ── */}
          {bookingType === "single" && (
            <div className="bn-field">
              <label>Wash Package *</label>
              <select required value={form.package_id}
                onChange={e => setForm({ ...form, package_id: parseInt(e.target.value) })}>
                <option value="">Select package</option>
                {packages.map(p => (
                  <option key={p.package_id} value={p.package_id}>{p.package_name} — ₹{p.price}</option>
                ))}
              </select>
            </div>
          )}

          {/* ── Vehicle — auto-filled from last booking ── */}
          <div className="bn-row">
            <div className="bn-field">
              <label>Vehicle Type *</label>
              <select required value={form.vehicle_type_id}
                onChange={e => setForm({ ...form, vehicle_type_id: parseInt(e.target.value) })}>
                <option value="">Select type</option>
                {vehicleTypes.map(v => (
                  <option key={v.vehicle_type_id} value={v.vehicle_type_id}>{v.vehicle_name}</option>
                ))}
              </select>
            </div>
            <div className="bn-field">
              <label>Vehicle Number Plate *</label>
              <input required value={form.vehicle_number}
                onChange={e => setForm({ ...form, vehicle_number: e.target.value })}
                placeholder="e.g. KA 09 AB 1234" />
            </div>
          </div>

          {/* ── Date & time ── */}
          <div className="bn-row">
            <div className="bn-field">
              <label>Preferred Date *</label>
              <input required type="date" value={form.date}
                min={(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })()}
                onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="bn-field">
              <label>Preferred Time *</label>
              <select required value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })}>
                <option value="">Select time slot</option>
                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* ── Payment mode (optional) ── */}
          <div className="bn-row">
            <div className="bn-field">
              <label>Payment Mode <span className="bn-optional">(optional)</span></label>
              <select value={form.payment_mode}
                onChange={e => setForm({ ...form, payment_mode: e.target.value })}>
                <option value="">Select payment mode</option>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>
            </div>
          </div>

          <button type="submit" className="bn-btn-primary bn-btn-submit">
            {hasActiveCard && bookingType === "annual"
              ? "Book a Wash (Annual Package)"
              : bookingType === "annual"
              ? "Reserve Annual Package Slot"
              : "Confirm Appointment"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
