import React, { useEffect, useState } from "react";
import "../css/Dashboard.css";
import { apiRequest } from "../utils/APIrequest";
import { BASE_URL } from "../services/utils";
import BookingEditModal from "../components/BookingEditModal";

export default function OlderBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState(null);

  const fetchBookings = () => {
    setLoading(true);
    apiRequest({ url: `${BASE_URL}/bookings/by-filter?filter=past` })
      .then(setBookings).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const statusClass = (s) => {
    const map = { pending: "badge-pending", confirmed: "badge-confirmed", completed: "badge-completed", cancelled: "badge-cancelled" };
    return map[s] || "badge-pending";
  };

  return (
    <div>
      <div className="page-title">Past Appointments</div>
      <div className="page-sub">Historical appointment records · {bookings.length} total</div>

      <div className="cc-table-wrap">
        <table className="cc-table">
          <thead>
            <tr>
              <th>#</th><th>Date</th><th>Time</th><th>Customer</th><th>Phone</th>
              <th>Vehicle</th><th>Plate</th><th>Package</th><th>Staff</th><th>Status</th><th>Paid</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={12} className="cc-table-empty">Loading...</td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan={12} className="cc-table-empty">No past appointments found.</td></tr>
            ) : (
              bookings.map(b => (
                <tr key={b.booking_id}>
                  <td>{b.booking_id}</td>
                  <td>{b.appointment_date}</td>
                  <td>{b.appointment_time}</td>
                  <td>{b.customer_name}</td>
                  <td>{b.customer_phone}</td>
                  <td>{b.vehicle_type_name}</td>
                  <td>{b.vehicle_number || "—"}</td>
                  <td>{b.package_name}</td>
                  <td>{b.staff_name || "—"}</td>
                  <td><span className={`dash-status-badge ${statusClass(b.status)}`}>{b.status}</span></td>
                  <td>₹{b.payment_paid || 0}</td>
                  <td>
                    <button className="action-btn btn-edit" onClick={() => setEditingBooking(b)}>Edit</button>
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
