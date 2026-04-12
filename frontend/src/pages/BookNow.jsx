import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/APIrequest";
import { BASE_URL } from "../services/utils";
import "../css/BookNow.css";

const ALL_TIMES = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

export default function BookNow() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [form, setForm] = useState({
    phone: "", name: "",
    package_id: "", vehicle_type_id: "", vehicle_number: "",
    date: "", time: "",
  });
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    apiRequest({ url: `${BASE_URL}/bookings/packages` }).then(setPackages).catch(() => {});
    apiRequest({ url: `${BASE_URL}/bookings/vehicle-types` }).then(setVehicleTypes).catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.date) { setBookedSlots([]); return; }
    apiRequest({ url: `${BASE_URL}/bookings/booked-slots?date=${form.date}` })
      .then(setBookedSlots)
      .catch(() => setBookedSlots([]));
  }, [form.date]);

  const getAvailableTimes = () => {
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    const currentHHMM = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    return ALL_TIMES.filter(t => {
      if (bookedSlots.includes(t)) return false;
      if (form.date === today && t <= currentHHMM) return false;
      return true;
    });
  };

  const lookupCustomer = async () => {
    if (!form.phone || form.phone.length < 10) return;
    try {
      const c = await apiRequest({ url: `${BASE_URL}/customers/details/${form.phone}` });
      setForm(f => ({ ...f, name: c.name }));
      setCustomerId(c.customer_id);
    } catch { setCustomerId(null); }
  };

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
          data: { name: form.name || "Online Customer", phone_number: form.phone },
        });
        cId = res.customer_id;
      } catch (ex) {
        setErr("Could not register customer: " + ex.message);
        return;
      }
    }

    try {
      const pkg = packages.find(p => p.package_id === parseInt(form.package_id));
      await apiRequest({
        url: `${BASE_URL}/bookings/submit`, method: "POST",
        data: {
          customer_id: cId,
          package_id: parseInt(form.package_id),
          vehicle_type_id: parseInt(form.vehicle_type_id),
          vehicle_number: form.vehicle_number || null,
          appointment_date: form.date,
          appointment_time: form.time,
          status: "pending",
          payment_total: pkg ? pkg.price : null,
          payment_paid: 0,
        },
      });
      setMsg({ phone: form.phone });
      localStorage.removeItem("access_token");
    } catch (ex) {
      setErr(ex.message);
    }
  };

  if (msg) {
    return (
      <div className="bn-page">
        <div className="bn-success">
          <div className="bn-success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <h2>Appointment Booked!</h2>
          <p>Your car wash appointment has been scheduled. We'll confirm via call to <strong>{msg.phone}</strong>.</p>
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
          <div className="bn-row">
            <div className="bn-field">
              <label>Phone Number *</label>
              <input required value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                onBlur={lookupCustomer} placeholder="10-digit mobile" />
            </div>
            <div className="bn-field">
              <label>Your Name *</label>
              <input required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
            </div>
          </div>

          <div className="bn-row">
            <div className="bn-field">
              <label>Wash Package *</label>
              <select required value={form.package_id}
                onChange={e => setForm({ ...form, package_id: e.target.value })}>
                <option value="">Select package</option>
                {packages.map(p => <option key={p.package_id} value={p.package_id}>{p.package_name} — ₹{p.price}</option>)}
              </select>
            </div>
            <div className="bn-field">
              <label>Vehicle Type *</label>
              <select required value={form.vehicle_type_id}
                onChange={e => setForm({ ...form, vehicle_type_id: e.target.value })}>
                <option value="">Select type</option>
                {vehicleTypes.map(v => <option key={v.vehicle_type_id} value={v.vehicle_type_id}>{v.vehicle_name}</option>)}
              </select>
            </div>
          </div>

          <div className="bn-field">
            <label>Vehicle Number Plate <span className="bn-optional">(optional)</span></label>
            <input value={form.vehicle_number}
              onChange={e => setForm({ ...form, vehicle_number: e.target.value })} placeholder="e.g. KA 09 AB 1234" />
          </div>

          <div className="bn-row">
            <div className="bn-field">
              <label>Preferred Date *</label>
              <input required type="date" value={form.date}
                min={new Date().toISOString().split("T")[0]}
                onChange={e => setForm({ ...form, date: e.target.value, time: "" })} />
            </div>
            <div className="bn-field">
              <label>Preferred Time *</label>
              <select required value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })}>
                <option value="">Select time slot</option>
                {getAvailableTimes().map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="bn-btn-primary bn-btn-submit">
            Confirm Appointment
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
}
