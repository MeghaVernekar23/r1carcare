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
    phone: "",
    name: "",
    package_id: "",
    vehicle_type_id: "",
    vehicle_number: "",
    date: "",
    time: "",
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
    if (!form.date) {
      setBookedSlots([]);
      return;
    }
    apiRequest({ url: `${BASE_URL}/bookings/booked-slots?date=${form.date}` })
      .then(setBookedSlots)
      .catch(() => setBookedSlots([]));
  }, [form.date]);

  const getAvailableTimes = () => {
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    const currentHHMM = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    return ALL_TIMES.filter((time) => {
      if (bookedSlots.includes(time)) return false;
      if (form.date === today && time <= currentHHMM) return false;
      return true;
    });
  };

  const lookupCustomer = async () => {
    if (!form.phone || form.phone.length < 10) return;
    try {
      const customer = await apiRequest({ url: `${BASE_URL}/customers/details/${form.phone}` });
      setForm((prev) => ({ ...prev, name: customer.name }));
      setCustomerId(customer.customer_id);
    } catch {
      setCustomerId(null);
    }
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
          url: `${BASE_URL}/customers/submit`,
          method: "POST",
          data: { name: form.name || "Online Customer", phone_number: form.phone },
        });
        cId = res.customer_id;
      } catch (error) {
        setErr(`Could not register customer: ${error.message}`);
        return;
      }
    }

    try {
      const pkg = packages.find((item) => item.package_id === parseInt(form.package_id, 10));
      await apiRequest({
        url: `${BASE_URL}/bookings/submit`,
        method: "POST",
        data: {
          customer_id: cId,
          package_id: parseInt(form.package_id, 10),
          vehicle_type_id: parseInt(form.vehicle_type_id, 10),
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
    } catch (error) {
      setErr(error.message);
    }
  };

  if (msg) {
    return (
      <div className="bn-page">
        <div className="bn-success-wrap">
          <div className="bn-success">
            <div className="bn-success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#17734b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2>Appointment booked</h2>
            <p>
              Your car wash appointment has been scheduled. The team will confirm the booking on{" "}
              <strong>{msg.phone}</strong>.
            </p>
            <button className="bn-btn-primary" onClick={() => navigate("/")}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bn-page">
      <div className="bn-layout bn-layout-simple">
        <section className="bn-showcase">
          <div className="bn-nav">
            <div className="bn-brand">
              <span className="bn-brand-mark">R1</span>
              <span>
                <strong>R1 Car Care</strong>
                <small>Online wash booking</small>
              </span>
            </div>
            <button className="bn-back" onClick={() => navigate("/")}>
              Back to Home
            </button>
          </div>

          <div className="bn-copy">
            <span className="bn-kicker">Book your slot</span>
            <h1>Simple booking for your next wash.</h1>
            <p>Choose the package, vehicle type, date, and time slot to confirm your appointment.</p>
          </div>

          <div className="bn-showcase-note">
            <strong>Quick entry</strong>
            <span>Returning customers can be recognized from their phone number automatically.</span>
          </div>
        </section>

        <section className="bn-panel">
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
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    onBlur={lookupCustomer}
                    placeholder="10-digit mobile"
                  />
                </div>
                <div className="bn-field">
                  <label>Your Name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Full name"
                  />
                </div>
              </div>

              <div className="bn-row">
                <div className="bn-field">
                  <label>Wash Package *</label>
                  <select
                    required
                    value={form.package_id}
                    onChange={(e) => setForm({ ...form, package_id: e.target.value })}
                  >
                    <option value="">Select package</option>
                    {packages.map((pkg) => (
                      <option key={pkg.package_id} value={pkg.package_id}>
                        {pkg.package_name} - Rs {pkg.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="bn-field">
                  <label>Vehicle Type *</label>
                  <select
                    required
                    value={form.vehicle_type_id}
                    onChange={(e) => setForm({ ...form, vehicle_type_id: e.target.value })}
                  >
                    <option value="">Select type</option>
                    {vehicleTypes.map((vehicle) => (
                      <option key={vehicle.vehicle_type_id} value={vehicle.vehicle_type_id}>
                        {vehicle.vehicle_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bn-field">
                <label>
                  Vehicle Number Plate <span className="bn-optional">(optional)</span>
                </label>
                <input
                  value={form.vehicle_number}
                  onChange={(e) => setForm({ ...form, vehicle_number: e.target.value })}
                  placeholder="e.g. KA 09 AB 1234"
                />
              </div>

              <div className="bn-row">
                <div className="bn-field">
                  <label>Preferred Date *</label>
                  <input
                    required
                    type="date"
                    value={form.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setForm({ ...form, date: e.target.value, time: "" })}
                  />
                </div>
                <div className="bn-field">
                  <label>Preferred Time *</label>
                  <select
                    required
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                  >
                    <option value="">Select time slot</option>
                    {getAvailableTimes().map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="bn-btn-primary bn-btn-submit">
                Confirm Appointment
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
