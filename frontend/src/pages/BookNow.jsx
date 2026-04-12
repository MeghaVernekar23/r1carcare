import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/APIrequest";
import { BASE_URL } from "../services/utils";

const TIMES = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

export default function BookNow() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    phone: "", name: "",
    package_id: "", vehicle_type_id: "", vehicle_number: "",
    date: "", time: "",
  });
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    apiRequest({ url: `${BASE_URL}/bookings/packages` }).then(setPackages).catch(() => {});
    apiRequest({ url: `${BASE_URL}/bookings/vehicle-types` }).then(setVehicleTypes).catch(() => {});
  }, []);

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

    // login as customer account to get token
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
      <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🚗✨</div>
          <h2 style={{ color: "#00c6ff", fontSize: "1.8rem", fontWeight: 900, marginBottom: ".75rem" }}>Appointment Booked!</h2>
          <p style={{ color: "#94a3b8", marginBottom: "1.5rem", lineHeight: 1.7 }}>
            Your car wash appointment has been scheduled. We'll confirm via call to <strong style={{ color: "#e2e8f0" }}>{msg.phone}</strong>.
          </p>
          <button onClick={() => navigate("/")} style={{ padding: ".65rem 1.75rem", background: "linear-gradient(135deg,#1a73e8,#00c6ff)", border: "none", borderRadius: 10, color: "#fff", fontSize: ".9rem", fontWeight: 700, cursor: "pointer" }}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const styles = {
    page: { minHeight: "100vh", background: "#0a0f1e", padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center" },
    nav: { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: 700, marginBottom: "2rem" },
    card: { background: "#111827", border: "1px solid rgba(0,198,255,0.15)", borderRadius: 20, padding: "2.5rem", width: "100%", maxWidth: 700 },
    title: { fontSize: "1.5rem", fontWeight: 900, color: "#e2e8f0", marginBottom: ".25rem" },
    sub: { color: "#64748b", fontSize: ".9rem", marginBottom: "2rem" },
    label: { display: "block", fontSize: ".82rem", fontWeight: 600, color: "#94a3b8", marginBottom: ".4rem" },
    input: { width: "100%", padding: ".65rem 1rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e2e8f0", fontSize: ".9rem", outline: "none", marginBottom: "1.25rem" },
    btn: { padding: ".65rem 1.5rem", background: "linear-gradient(135deg,#1a73e8,#00c6ff)", border: "none", borderRadius: 10, color: "#fff", fontSize: ".9rem", fontWeight: 700, cursor: "pointer" },
    row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  };

  return (
    <div style={styles.page}>
      <div style={styles.nav}>
        <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#e2e8f0" }}>🚗 <span style={{ color: "#00c6ff" }}>R1</span> Car Care</div>
        <button onClick={() => navigate("/")} style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#94a3b8", padding: ".35rem .85rem", cursor: "pointer", fontSize: ".85rem" }}>← Home</button>
      </div>

      <div style={styles.card}>
        <div style={styles.title}>Book Your Car Wash</div>
        <div style={styles.sub}>Fill in the details below to schedule your appointment.</div>

        {err && <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", color: "#f87171", borderRadius: 10, padding: ".75rem 1rem", marginBottom: "1.25rem", fontSize: ".875rem" }}>{err}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <div>
              <label style={styles.label}>Phone Number *</label>
              <input style={styles.input} required value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                onBlur={lookupCustomer} placeholder="10-digit mobile" />
            </div>
            <div>
              <label style={styles.label}>Your Name *</label>
              <input style={styles.input} required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
            </div>
          </div>

          <div style={styles.row}>
            <div>
              <label style={styles.label}>Wash Package *</label>
              <select style={styles.input} required value={form.package_id}
                onChange={e => setForm({ ...form, package_id: e.target.value })}>
                <option value="">Select package</option>
                {packages.map(p => <option key={p.package_id} value={p.package_id}>{p.package_name} — ₹{p.price}</option>)}
              </select>
            </div>
            <div>
              <label style={styles.label}>Vehicle Type *</label>
              <select style={styles.input} required value={form.vehicle_type_id}
                onChange={e => setForm({ ...form, vehicle_type_id: e.target.value })}>
                <option value="">Select type</option>
                {vehicleTypes.map(v => <option key={v.vehicle_type_id} value={v.vehicle_type_id}>{v.vehicle_name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={styles.label}>Vehicle Number Plate</label>
            <input style={styles.input} value={form.vehicle_number}
              onChange={e => setForm({ ...form, vehicle_number: e.target.value })} placeholder="e.g. KA 09 AB 1234 (optional)" />
          </div>

          <div style={styles.row}>
            <div>
              <label style={styles.label}>Preferred Date *</label>
              <input style={styles.input} required type="date" value={form.date}
                min={new Date().toISOString().split("T")[0]}
                onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label style={styles.label}>Preferred Time *</label>
              <select style={styles.input} required value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })}>
                <option value="">Select time slot</option>
                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" style={styles.btn}>Confirm Appointment →</button>
        </form>
      </div>
    </div>
  );
}
