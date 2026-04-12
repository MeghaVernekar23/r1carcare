import React, { useEffect, useState } from "react";
import "../css/Dashboard.css";
import { apiRequest } from "../utils/APIrequest";
import { BASE_URL } from "../services/utils";
import BookingEditModal from "../components/BookingEditModal";

export default function TodaysBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState(null);

  const fetchBookings = () => {
    setLoading(true);
    apiRequest({ url: `${BASE_URL}/bookings/by-filter?filter=today` })
      .then(setBookings)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    await apiRequest({ url: `${BASE_URL}/bookings/delete/${id}`, method: "DELETE" });
    fetchBookings();
  };

  const statusClass = (s) => {
    const map = { pending: "badge-pending", confirmed: "badge-confirmed", completed: "badge-completed", cancelled: "badge-cancelled" };
    return map[s] || "badge-pending";
  };

  return (
    <div>
      <div className="page-title">Today's Appointments</div>
      <div className="page-sub">{new Date().toDateString()} · {bookings.length} appointment(s)</div>

      <div className="cc-table-wrap">
        <table className="cc-table">
          <thead>
            <tr>
              <th>#</th><th>Time</th><th>Customer</th><th>Phone</th>
              <th>Vehicle</th><th>Plate</th><th>Package</th><th>Staff</th><th>Status</th><th>Amount</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={11} className="cc-table-empty">Loading...</td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan={11} className="cc-table-empty">No appointments for today.</td></tr>
            ) : (
              bookings.map(b => (
                <tr key={b.booking_id}>
                  <td>{b.booking_id}</td>
                  <td>{b.appointment_time}</td>
                  <td>{b.customer_name}</td>
                  <td>{b.customer_phone}</td>
                  <td>{b.vehicle_type_name}</td>
                  <td>{b.vehicle_number || "—"}</td>
                  <td>{b.package_name}</td>
                  <td>{b.staff_name || "—"}</td>
                  <td><span className={`dash-status-badge ${statusClass(b.status)}`}>{b.status}</span></td>
                  <td>₹{b.payment_total || 0}</td>
                  <td style={{ display: "flex", gap: "0.4rem" }}>
                    <button className="action-btn btn-edit" onClick={() => setEditingBooking(b)}>Edit</button>
                    <button className="action-btn btn-delete" onClick={() => handleDelete(b.booking_id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingBooking && (
        <BookingEditModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSaved={() => { setEditingBooking(null); fetchBookings(); }}
        />
      )}
    </div>
  );
}
