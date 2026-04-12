import React, { useEffect, useState } from "react";
import "../css/Dashboard.css";
import { apiRequest } from "../utils/APIrequest";
import { BASE_URL } from "../services/utils";

const emptyForm = {
  customer_phone: "",
  customer_id: null,
  package_id: "",
  vehicle_type_id: "",
  vehicle_number: "",
  appointment_date: "",
  appointment_time: "",
  staff_id: "",
  status: "pending",
  payment_mode: "",
  payment_total: "",
  payment_paid: "",
  notes: "",
};

export default function AddBooking() {
  const [form, setForm] = useState(emptyForm);
  const [packages, setPackages] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [availableStaff, setAvailableStaff] = useState([]);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    apiRequest({ url: `${BASE_URL}/bookings/packages` }).then(setPackages).catch(() => {});
    apiRequest({ url: `${BASE_URL}/bookings/vehicle-types` }).then(setVehicleTypes).catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.appointment_date) { setAvailableStaff([]); return; }
    apiRequest({ url: `${BASE_URL}/bookings/available-staff?date=${form.appointment_date}` })
      .then(setAvailableStaff)
      .catch(() => setAvailableStaff([]));
  }, [form.appointment_date]);

  const lookupCustomer = async () => {
    if (!form.customer_phone || form.customer_phone.length < 10) return;
    try {
      const c = await apiRequest({ url: `${BASE_URL}/customers/details/${form.customer_phone}` });
      setForm(f => ({ ...f, customer_id: c.customer_id }));
      setCustomerName(c.name);
    } catch {
      setCustomerName("");
      setForm(f => ({ ...f, customer_id: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null); setErr(null);

    let customerId = form.customer_id;
    if (!customerId) {
      try {
        const res = await apiRequest({
          url: `${BASE_URL}/customers/submit`,
          method: "POST",
          data: { name: customerName || "Walk-in", phone_number: form.customer_phone },
        });
        customerId = res.customer_id;
      } catch (ex) {
        setErr("Could not create customer: " + ex.message);
        return;
      }
    }

    try {
      const payload = {
        customer_id: customerId,
        package_id: parseInt(form.package_id),
        vehicle_type_id: parseInt(form.vehicle_type_id),
        vehicle_number: form.vehicle_number || null,
        appointment_date: form.appointment_date,
        appointment_time: form.appointment_time,
        staff_id: form.staff_id ? parseInt(form.staff_id) : null,
        status: form.status,
        payment_mode: form.payment_mode || null,
        payment_total: form.payment_total ? parseFloat(form.payment_total) : null,
        payment_paid: form.payment_paid ? parseFloat(form.payment_paid) : null,
        notes: form.notes || null,
      };
      await apiRequest({ url: `${BASE_URL}/bookings/submit`, method: "POST", data: payload });
      setMsg("Appointment booked successfully!");
      setForm(emptyForm);
      setCustomerName("");
      setAvailableStaff([]);
    } catch (ex) {
      setErr(ex.message);
    }
  };

  return (
    <div>
      <div className="page-title">Add Appointment</div>
      <div className="page-sub">Schedule a new car wash appointment</div>

      {msg && <div className="cc-alert-success">{msg}</div>}
      {err && <div className="cc-alert-error">{err}</div>}

      <div className="cc-form-card">
        <form onSubmit={handleSubmit}>
          <div className="cc-form-row">
            <div className="cc-form-group">
              <label>Customer Phone</label>
              <input
                required value={form.customer_phone}
                onChange={e => setForm({ ...form, customer_phone: e.target.value })}
                onBlur={lookupCustomer}
                placeholder="Phone number"
              />
            </div>
            <div className="cc-form-group">
              <label>Customer Name</label>
              <input
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Auto-filled or enter manually"
              />
            </div>
          </div>

          <div className="cc-form-row">
            <div className="cc-form-group">
              <label>Wash Package</label>
              <select required value={form.package_id} onChange={e => setForm({ ...form, package_id: e.target.value })}>
                <option value="">Select package</option>
                {packages.map(p => <option key={p.package_id} value={p.package_id}>{p.package_name} — ₹{p.price}</option>)}
              </select>
            </div>
            <div className="cc-form-group">
              <label>Vehicle Type</label>
              <select required value={form.vehicle_type_id} onChange={e => setForm({ ...form, vehicle_type_id: e.target.value })}>
                <option value="">Select vehicle type</option>
                {vehicleTypes.map(v => <option key={v.vehicle_type_id} value={v.vehicle_type_id}>{v.vehicle_name}</option>)}
              </select>
            </div>
          </div>

          <div className="cc-form-row">
            <div className="cc-form-group">
              <label>Vehicle Number Plate</label>
              <input value={form.vehicle_number} onChange={e => setForm({ ...form, vehicle_number: e.target.value })} placeholder="e.g. KA 09 AB 1234" />
            </div>
            <div className="cc-form-group">
              <label>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="cc-form-row">
            <div className="cc-form-group">
              <label>Appointment Date</label>
              <input required type="date" value={form.appointment_date}
                onChange={e => setForm({ ...form, appointment_date: e.target.value, staff_id: "" })} />
            </div>
            <div className="cc-form-group">
              <label>Appointment Time</label>
              <input required type="time" value={form.appointment_time} onChange={e => setForm({ ...form, appointment_time: e.target.value })} />
            </div>
          </div>

          <div className="cc-form-row">
            <div className="cc-form-group">
              <label>Assign Staff</label>
              <select value={form.staff_id} onChange={e => setForm({ ...form, staff_id: e.target.value })}
                disabled={!form.appointment_date}>
                <option value="">{form.appointment_date ? "Unassigned" : "Select a date first"}</option>
                {availableStaff.map(s => (
                  <option key={s.staff_id} value={s.staff_id}>
                    {s.name}{s.role ? ` — ${s.role}` : ""}
                  </option>
                ))}
              </select>
              {form.appointment_date && availableStaff.length === 0 && (
                <small style={{ color: "#94a3b8" }}>No staff available on this date</small>
              )}
            </div>
            <div className="cc-form-group" />
          </div>

          <div className="cc-form-row">
            <div className="cc-form-group">
              <label>Payment Mode</label>
              <select value={form.payment_mode} onChange={e => setForm({ ...form, payment_mode: e.target.value })}>
                <option value="">Select</option>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>
            </div>
            <div className="cc-form-group">
              <label>Total Amount (₹)</label>
              <input type="number" value={form.payment_total} onChange={e => setForm({ ...form, payment_total: e.target.value })} placeholder="0" />
            </div>
          </div>

          <div className="cc-form-row">
            <div className="cc-form-group">
              <label>Amount Paid (₹)</label>
              <input type="number" value={form.payment_paid} onChange={e => setForm({ ...form, payment_paid: e.target.value })} placeholder="0" />
            </div>
            <div className="cc-form-group">
              <label>Notes</label>
              <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" />
            </div>
          </div>

          <button type="submit" className="cc-btn-submit">Book Appointment</button>
        </form>
      </div>
    </div>
  );
}
