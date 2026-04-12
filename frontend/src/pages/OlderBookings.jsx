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
      .then(setBookings)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const statusClass = (status) => {
    const map = {
      pending: "badge-pending",
      confirmed: "badge-confirmed",
      completed: "badge-completed",
      cancelled: "badge-cancelled",
    };
    return map[status] || "badge-pending";
  };

  return (
    <div className="page-shell">
      <section className="page-header">
        <div className="page-header-copy">
          <span className="page-eyebrow">History</span>
          <h1 className="page-title">Past appointments</h1>
          <p className="page-sub">Historical wash records with {bookings.length} total appointments.</p>
        </div>
      </section>

      <div className="cc-table-wrap">
        <table className="cc-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Time</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Vehicle</th>
              <th>Plate</th>
              <th>Package</th>
              <th>Staff</th>
              <th>Status</th>
              <th>Paid</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={12} className="cc-table-empty">
                  Loading...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={12} className="cc-table-empty">
                  No past appointments found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.booking_id}>
                  <td>{booking.booking_id}</td>
                  <td>{booking.appointment_date}</td>
                  <td>{booking.appointment_time}</td>
                  <td>{booking.customer_name}</td>
                  <td>{booking.customer_phone}</td>
                  <td>{booking.vehicle_type_name}</td>
                  <td>{booking.vehicle_number || "-"}</td>
                  <td>{booking.package_name}</td>
                  <td>{booking.staff_name || "-"}</td>
                  <td>
                    <span className={`dash-status-badge ${statusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>Rs {booking.payment_paid || 0}</td>
                  <td>
                    <button className="action-btn btn-edit" onClick={() => setEditingBooking(booking)}>
                      Edit
                    </button>
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
          onSaved={() => {
            setEditingBooking(null);
            fetchBookings();
          }}
        />
      )}
    </div>
  );
}
