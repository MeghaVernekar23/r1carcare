import React, { useEffect, useState } from "react";
import { apiRequest } from "../utils/APIrequest";
import { BASE_URL } from "../services/utils";

export default function BookingEditModal({ booking, onClose, onSaved }) {
  const [form, setForm] = useState({
    package_id: booking.package_id || "",
    vehicle_type_id: booking.vehicle_type_id || "",
    vehicle_number: booking.vehicle_number || "",
    appointment_date: booking.appointment_date || "",
    appointment_time: booking.appointment_time || "",
    staff_id: booking.staff_id || "",
    status: booking.status || "pending",
    notes: booking.notes || "",
    payment_mode: booking.payment_mode || "",
    payment_total: booking.payment_total ?? "",
    payment_paid: booking.payment_paid ?? "",
    payment_notes: booking.payment_notes || "",
  });

  const [packages, setPackages] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [availableStaff, setAvailableStaff] = useState([]);
  const [err, setErr] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiRequest({ url: `${BASE_URL}/bookings/packages/all` }).then(setPackages).catch(() => {});
    apiRequest({ url: `${BASE_URL}/bookings/vehicle-types` }).then(setVehicleTypes).catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.appointment_date) { setAvailableStaff([]); return; }
    apiRequest({ url: `${BASE_URL}/bookings/available-staff?date=${form.appointment_date}` })
      .then(data => {
        // Always include the currently assigned staff even if on holiday
        if (booking.staff_id && !data.find(s => s.staff_id === booking.staff_id)) {
          data = [{ staff_id: booking.staff_id, name: booking.staff_name, role: null }, ...data];
        }
        setAvailableStaff(data);
      })
      .catch(() => setAvailableStaff([]));
  }, [form.appointment_date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setErr(null);
    try {
      await apiRequest({
        url: `${BASE_URL}/bookings/update/${booking.booking_id}`,
        method: "PUT",
        data: {
          package_id: form.package_id ? parseInt(form.package_id) : null,
          vehicle_type_id: form.vehicle_type_id ? parseInt(form.vehicle_type_id) : null,
          vehicle_number: form.vehicle_number || null,
          appointment_date: form.appointment_date || null,
          appointment_time: form.appointment_time || null,
          staff_id: form.staff_id ? parseInt(form.staff_id) : null,
          status: form.status || null,
          notes: form.notes || null,
          payment_mode: form.payment_mode || null,
          payment_total: form.payment_total !== "" ? parseFloat(form.payment_total) : null,
          payment_paid: form.payment_paid !== "" ? parseFloat(form.payment_paid) : null,
          payment_notes: form.payment_notes || null,
        },
      });
      onSaved();
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div className="modal-header">
          <h3>Edit Appointment <span className="modal-id">#{booking.booking_id}</span></h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-customer-info">
          <span><strong>{booking.customer_name}</strong></span>
          <span>{booking.customer_phone}</span>
        </div>

        {err && <div className="cc-alert-error" style={{ margin: "0 0 1rem" }}>{err}</div>}

        <form onSubmit={handleSubmit}>
          <div className="cc-form-row">
            <div className="cc-form-group">
              <label>Wash Package</label>
              <select value={form.package_id} onChange={e => setForm({ ...form, package_id: e.target.value })}>
                <option value="">Select package</option>
                {packages.map(p => (
                  <option key={p.package_id} value={p.package_id}>{p.package_name} — ₹{p.price}</option>
                ))}
              </select>
            </div>
            <div className="cc-form-group">
              <label>Vehicle Type</label>
              <select value={form.vehicle_type_id} onChange={e => setForm({ ...form, vehicle_type_id: e.target.value })}>
                <option value="">Select type</option>
                {vehicleTypes.map(v => (
                  <option key={v.vehicle_type_id} value={v.vehicle_type_id}>{v.vehicle_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="cc-form-row">
            <div className="cc-form-group">
              <label>Appointment Date</label>
              <input type="date" value={form.appointment_date}
                onChange={e => setForm({ ...form, appointment_date: e.target.value, staff_id: "" })} />
            </div>
            <div className="cc-form-group">
              <label>Appointment Time</label>
              <input type="time" value={form.appointment_time}
                onChange={e => setForm({ ...form, appointment_time: e.target.value })} />
            </div>
          </div>

          <div className="cc-form-row">
            <div className="cc-form-group">
              <label>Vehicle Number Plate</label>
              <input value={form.vehicle_number}
                onChange={e => setForm({ ...form, vehicle_number: e.target.value })}
                placeholder="e.g. KA 09 AB 1234" />
            </div>
            <div className="cc-form-group">
              <label>Assign Staff</label>
              <select value={form.staff_id} onChange={e => setForm({ ...form, staff_id: e.target.value })}>
                <option value="">Unassigned</option>
                {availableStaff.map(s => (
                  <option key={s.staff_id} value={s.staff_id}>
                    {s.name}{s.role ? ` — ${s.role}` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="cc-form-row">
            <div className="cc-form-group">
              <label>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="cc-form-group">
              <label>Payment Mode</label>
              <select value={form.payment_mode} onChange={e => setForm({ ...form, payment_mode: e.target.value })}>
                <option value="">Select</option>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>
            </div>
          </div>

          <div className="cc-form-row">
            <div className="cc-form-group">
              <label>Total Amount (₹)</label>
              <input type="number" value={form.payment_total}
                onChange={e => setForm({ ...form, payment_total: e.target.value })} placeholder="0" />
            </div>
            <div className="cc-form-group">
              <label>Amount Paid (₹)</label>
              <input type="number" value={form.payment_paid}
                onChange={e => setForm({ ...form, payment_paid: e.target.value })} placeholder="0" />
            </div>
          </div>

          <div className="cc-form-row">
            <div className="cc-form-group">
              <label>Notes</label>
              <input value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" />
            </div>
            <div className="cc-form-group">
              <label>Payment Notes</label>
              <input value={form.payment_notes}
                onChange={e => setForm({ ...form, payment_notes: e.target.value })} placeholder="Optional" />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="action-btn btn-edit" onClick={onClose}>Cancel</button>
            <button type="submit" className="cc-btn-submit" disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
