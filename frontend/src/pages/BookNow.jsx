import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/APIrequest";
import { BASE_URL } from "../services/utils";
import "../css/BookNow.css";

const TIMES = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

const PLANS = {
  "1month": {
    label: "1 Month", badge: "BASIC",
    washes: 4, validityMonths: 1, validityLabel: "1 month",
    pricing: { hatchback: 1800, sedan: 2000, suv: 2200 },
    birthdayBoxDiscountPct: 10,
    perks: ["10% OFF on Birthday Box"],
  },
  "2month": {
    label: "2 Month", badge: "SMART",
    washes: 8, validityMonths: 2, validityLabel: "2 months",
    pricing: { hatchback: 3400, sedan: 3800, suv: 4200 },
    birthdayBoxDiscountPct: 10,
    perks: ["10% OFF on Birthday Box", "Priority Booking"],
  },
  "3month": {
    label: "3 Month", badge: "MOST POPULAR",
    washes: 12, validityMonths: 3, validityLabel: "3 months",
    pricing: { hatchback: 4800, sedan: 5400, suv: 6000 },
    birthdayBoxDiscountPct: 12,
    perks: ["1 Rubbing/Polishing", "12% OFF on Birthday Box", "Free Basic Decoration"],
  },
  "6month": {
    label: "6 Month", badge: "PREMIUM",
    washes: 24, validityMonths: 6, validityLabel: "6 months",
    pricing: { hatchback: 9000, sedan: 10200, suv: 11400 },
    birthdayBoxDiscountPct: 15,
    perks: ["1 Rubbing/Polishing", "1 Interior Deep Cleaning", "15% OFF on Birthday Box", "Free Add-on"],
  },
  "annual": {
    label: "Annual", badge: "VIP",
    washes: 48, validityMonths: 12, validityLabel: "12 months",
    pricing: { flat: 4000 },
    birthdayBoxDiscountPct: 50,
    perks: ["1 FREE wash after 48 washes", "50% OFF at BirthdayBox"],
  },
};

const VEHICLE_CATS = [
  { key: "hatchback", label: "Hatchback" },
  { key: "sedan", label: "Sedan" },
  { key: "suv", label: "SUV" },
];

const PLAN_BADGE_CLASS = {
  "1month": "bn-plan-badge--basic",
  "2month": "bn-plan-badge--smart",
  "3month": "bn-plan-badge--popular",
  "6month": "bn-plan-badge--premium",
  "annual": "bn-plan-badge--vip",
};

function getPlanPrice(plan, vehicleCat) {
  if (plan.pricing.flat !== undefined) return plan.pricing.flat;
  return plan.pricing[vehicleCat] || 0;
}

function ActiveCardView({ card }) {
  const planType = card.plan_type || "annual";
  const plan = PLANS[planType] || PLANS["annual"];
  const discountPct = card.birthday_box_discount_pct ?? (card.birthday_box_discount ? 50 : null);
  const pct = Math.round((card.washes_used / card.total_washes) * 100);

  return (
    <div className="bn-active-card">
      <div className="bn-ac-header">
        <div>
          <div className="bn-ac-title">{plan.label} Package</div>
          <div className="bn-ac-sub">Valid till {card.expiry_date} &nbsp;·&nbsp; ₹{card.price_paid} paid</div>
        </div>
        <span className={`bn-ac-badge bn-ac-badge--${card.status}`}>
          {card.status === "active" ? "ACTIVE" : card.status === "completed" ? "COMPLETED" : "EXPIRED"}
        </span>
      </div>

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

      <div className="bn-ac-bar-wrap">
        <div className="bn-ac-bar" style={{ width: `${pct}%` }} />
      </div>
      <div className="bn-ac-bar-labels">
        <span>0</span>
        <span>{card.total_washes} washes</span>
      </div>

      {card.free_wash_earned && !card.free_wash_used && (
        <div className="bn-ac-alert bn-ac-alert--free">
          🎉 All {card.total_washes} washes completed — you have 1 FREE wash! Mention it at the counter.
        </div>
      )}
      {discountPct && (
        <div className="bn-ac-alert bn-ac-alert--birthday">
          🎂 {discountPct}% off at BirthdayBox — show this at the counter
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
  const [selectedPlanType, setSelectedPlanType] = useState(null);
  const [selectedVehicleCategory, setSelectedVehicleCategory] = useState(null);
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

    try {
      const c = await apiRequest({ url: `${BASE_URL}/customers/details/${phone}` });
      setForm(f => ({ ...f, name: c.name }));
      setCustomerId(c.customer_id);
    } catch {
      setLooking(false);
      return;
    }

    try {
      const sc = await apiRequest({ url: `${BASE_URL}/stamp-cards/by-phone/${phone}` });
      if (sc && (sc.status === "active" || (sc.status === "completed" && !sc.free_wash_used))) {
        setStampCard(sc);
        setBookingType("annual");
      } else {
        setStampCard(null);
      }
    } catch {
      setStampCard(null);
    }

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

    if (isAnnualNew) {
      if (!selectedPlanType) {
        setErr("Please select a membership plan.");
        localStorage.removeItem("access_token");
        return;
      }
      const plan = PLANS[selectedPlanType];
      if (plan.pricing.flat === undefined && !selectedVehicleCategory) {
        setErr("Please select your vehicle type (Hatchback / Sedan / SUV) to see pricing.");
        localStorage.removeItem("access_token");
        return;
      }
    }

    if (bookingType === "single" && !form.package_id) {
      setErr("Please select a wash package.");
      localStorage.removeItem("access_token");
      return;
    }

    try {
      let notes = null;
      let cardIdForWash = null;
      let isFreeWash = false;

      if (isAnnualNew) {
        const plan = PLANS[selectedPlanType];
        const price = getPlanPrice(plan, selectedVehicleCategory);
        const cardRes = await apiRequest({
          url: `${BASE_URL}/stamp-cards/purchase`, method: "POST",
          data: {
            customer_id: cId,
            total_washes: plan.washes,
            price_paid: price,
            plan_type: selectedPlanType,
            validity_months: plan.validityMonths,
            birthday_box_discount_pct: plan.birthdayBoxDiscountPct,
          },
        });
        cardIdForWash = cardRes.card_id;
        const washRes = await apiRequest({
          url: `${BASE_URL}/stamp-cards/${cardIdForWash}/record-wash`, method: "POST",
        });
        notes = `${plan.label} Package activated — wash 1 of ${plan.washes} recorded · ${washRes.washes_remaining} remaining`;
      }

      if (isAnnualCard) {
        const planType = stampCard.plan_type || "annual";
        const plan = PLANS[planType] || PLANS["annual"];
        if (stampCard.free_wash_earned && !stampCard.free_wash_used) {
          await apiRequest({
            url: `${BASE_URL}/stamp-cards/${stampCard.card_id}/use-free-wash`, method: "POST",
          });
          notes = `${plan.label} Package — FREE WASH redeemed`;
          isFreeWash = true;
        } else {
          const washRes = await apiRequest({
            url: `${BASE_URL}/stamp-cards/${stampCard.card_id}/record-wash`, method: "POST",
          });
          notes = `${plan.label} Package — wash ${washRes.washes_used} of ${plan.washes} · ${washRes.washes_remaining} remaining`;
          if (washRes.free_wash_earned) notes += " · 🎉 Free wash earned!";
        }
      }

      const pkg = packages.find(p => p.package_id === form.package_id);
      const planPrice = isAnnualNew
        ? getPlanPrice(PLANS[selectedPlanType], selectedVehicleCategory)
        : null;

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
          payment_total: isAnnualNew ? planPrice : (isAnnualCard ? 0 : (pkg ? pkg.price : null)),
          payment_paid: isAnnualNew ? planPrice : 0,
          notes,
        },
      });

      const resolvedPlanType = isAnnualNew
        ? selectedPlanType
        : (stampCard?.plan_type || "annual");
      setMsg({ phone: form.phone.trim(), isAnnualNew, isAnnualCard, isFreeWash, planType: resolvedPlanType });
      localStorage.removeItem("access_token");
    } catch (ex) {
      setErr(ex.message);
      localStorage.removeItem("access_token");
    }
  };

  if (msg) {
    const msgPlan = PLANS[msg.planType] || PLANS["annual"];
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
            {msg.isFreeWash ? "Free Wash Booked!"
              : msg.isAnnualCard ? "Wash Booked!"
              : msg.isAnnualNew ? `${msgPlan.label} Package Activated!`
              : "Appointment Booked!"}
          </h2>
          <p>
            {msg.isFreeWash
              ? <>Your free wash has been redeemed and your slot is reserved. We'll confirm via call to <strong>{msg.phone}</strong>.</>
              : msg.isAnnualCard
              ? <>One wash has been deducted from your {msgPlan.label.toLowerCase()} package and your slot is reserved. We'll confirm via call to <strong>{msg.phone}</strong>.</>
              : msg.isAnnualNew
              ? <>Your {msgPlan.label.toLowerCase()} package is now active and wash #1 has been recorded. We'll confirm your slot via call to <strong>{msg.phone}</strong>.</>
              : <>Your appointment is scheduled. We'll confirm via call to <strong>{msg.phone}</strong>.</>
            }
          </p>
          <button className="bn-btn-primary" onClick={() => navigate("/")}>Back to Home</button>
        </div>
      </div>
    );
  }

  const selectedPlan = selectedPlanType ? PLANS[selectedPlanType] : null;
  const isTimedPlan = selectedPlan && selectedPlan.pricing.flat === undefined;
  const selectedPrice = selectedPlan ? getPlanPrice(selectedPlan, selectedVehicleCategory) : 0;

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

          {/* ── Booking type toggle ── */}
          <div className="bn-type-toggle">
            <button type="button"
              className={`bn-type-btn${bookingType === "single" ? " bn-type-btn--active" : ""}`}
              onClick={() => setBookingType("single")}>
              Single Wash
            </button>
            <button type="button"
              className={`bn-type-btn${bookingType === "annual" ? " bn-type-btn--active" : ""}`}
              onClick={() => setBookingType("annual")}>
              Membership Plans
              {hasActiveCard
                ? <span className="bn-type-badge bn-type-badge--card">Your Card</span>
                : <span className="bn-type-badge">Save more</span>
              }
            </button>
          </div>

          {/* ── Membership tab: existing card ── */}
          {bookingType === "annual" && hasActiveCard && (
            <ActiveCardView card={stampCard} />
          )}

          {/* ── Membership tab: new purchase ── */}
          {bookingType === "annual" && !hasActiveCard && (
            <>
              {/* Plan selection grid */}
              <div className="bn-section-label">Select a Plan</div>
              <div className="bn-plans-grid">
                {Object.entries(PLANS).map(([key, plan]) => (
                  <button key={key} type="button"
                    className={`bn-plan-card${selectedPlanType === key ? " bn-plan-card--selected" : ""}`}
                    onClick={() => { setSelectedPlanType(key); setSelectedVehicleCategory(null); }}>
                    <span className={`bn-plan-badge ${PLAN_BADGE_CLASS[key]}`}>{plan.badge}</span>
                    <div className="bn-plan-name">{plan.label}</div>
                    <div className="bn-plan-detail">{plan.washes} washes · {plan.validityLabel}</div>
                    <div className="bn-plan-price">
                      {plan.pricing.flat !== undefined
                        ? `₹${plan.pricing.flat.toLocaleString("en-IN")}`
                        : `₹${plan.pricing.hatchback.toLocaleString("en-IN")} – ₹${plan.pricing.suv.toLocaleString("en-IN")}`}
                    </div>
                  </button>
                ))}
              </div>

              {/* Vehicle category selector — only for tiered-price plans */}
              {selectedPlan && isTimedPlan && (
                <div className="bn-vcat-section">
                  <div className="bn-section-label">Your Vehicle Type (for pricing)</div>
                  <div className="bn-vcat-group">
                    {VEHICLE_CATS.map(v => (
                      <button key={v.key} type="button"
                        className={`bn-vcat-btn${selectedVehicleCategory === v.key ? " bn-vcat-btn--selected" : ""}`}
                        onClick={() => setSelectedVehicleCategory(v.key)}>
                        <div>{v.label}</div>
                        <div className="bn-vcat-price">₹{selectedPlan.pricing[v.key].toLocaleString("en-IN")}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected plan preview */}
              {selectedPlan && (
                <div className="bn-annual-card">
                  <div className="bn-annual-top">
                    <div>
                      <div className="bn-annual-title">{selectedPlan.label} Membership Plan</div>
                      <div className="bn-annual-sub">Pre-paid · {selectedPlan.validityLabel} validity</div>
                    </div>
                    {(selectedPlan.pricing.flat !== undefined || selectedVehicleCategory) && (
                      <div className="bn-annual-price">₹{selectedPrice.toLocaleString("en-IN")}</div>
                    )}
                  </div>
                  <div className="bn-annual-stamps">
                    {Array.from({ length: selectedPlan.washes }, (_, i) => (
                      <div key={i} className="bn-annual-dot">
                        <span className="bn-annual-dot-num">{i + 1}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bn-annual-perks">
                    {selectedPlan.perks.map((perk, i) => (
                      <span key={i} className="bn-annual-perk">✓ {perk}</span>
                    ))}
                  </div>
                  <p className="bn-annual-note">
                    {isTimedPlan && !selectedVehicleCategory
                      ? "Select your vehicle type above to see your price."
                      : `Book your first slot below. Bring ₹${selectedPrice.toLocaleString("en-IN")} on the day — staff will activate your card.`}
                  </p>
                </div>
              )}
            </>
          )}

          {/* ── Single wash: package selector ── */}
          {bookingType === "single" && (
            <div className="bn-field">
              <div className="bn-section-label">Select a Wash Package *</div>
              <div className="bn-plans-grid">
                {packages.map(p => (
                  <button key={p.package_id} type="button"
                    className={`bn-plan-card${form.package_id === p.package_id ? " bn-plan-card--selected" : ""}`}
                    onClick={() => setForm({ ...form, package_id: p.package_id })}>
                    <div className="bn-plan-name">{p.package_name}</div>
                    <div className="bn-plan-price">₹{p.price.toLocaleString("en-IN")}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Vehicle ── */}
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

          {/* ── Payment mode ── */}
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
              ? "Book a Wash (Membership)"
              : bookingType === "annual"
              ? selectedPlanType ? `Reserve ${PLANS[selectedPlanType].label} Slot` : "Reserve Membership Slot"
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
