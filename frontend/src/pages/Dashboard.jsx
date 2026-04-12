import React, { useEffect, useState } from "react";
import "../css/Dashboard.css";
import { apiRequest } from "../utils/APIrequest";
import { BASE_URL } from "../services/utils";

export default function Dashboard() {
  const [todayBookings, setTodayBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [nextBooking, setNextBooking] = useState(null);
  const user = JSON.parse(localStorage.getItem("current_user") || "{}");

  useEffect(() => {
    apiRequest({ url: `${BASE_URL}/bookings/by-filter?filter=today` })
      .then(setTodayBookings).catch(() => {});
    apiRequest({ url: `${BASE_URL}/bookings/by-filter?filter=upcoming` })
      .then(setUpcomingBookings).catch(() => {});
    apiRequest({ url: `${BASE_URL}/bookings/next-booking` })
      .then(setNextBooking).catch(() => {});
  }, []);

  const statusClass = (s) => {
    const map = { pending: "badge-pending", confirmed: "badge-confirmed", completed: "badge-completed", cancelled: "badge-cancelled" };
    return map[s] || "badge-pending";
  };

  return (
    <div className="dash-page">
      <h1>Dashboard</h1>
      <p className="dash-sub">Welcome back, {user.username || "Staff"}. Here's today's overview.</p>

      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-card-label">Today's Appointments</div>
          <div className="dash-card-value">{todayBookings.length}</div>
          <div className="dash-card-sub">Scheduled for today</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label">Upcoming</div>
          <div className="dash-card-value">{upcomingBookings.length}</div>
          <div className="dash-card-sub">Future appointments</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label">Pending Payments</div>
          <div className="dash-card-value">
            {todayBookings.filter(b => b.payment_paid < b.payment_total).length}
          </div>
          <div className="dash-card-sub">Today's pending</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label">Revenue Today</div>
          <div className="dash-card-value">
            ₹{todayBookings.reduce((s, b) => s + (b.payment_paid || 0), 0)}
          </div>
          <div className="dash-card-sub">Collected today</div>
        </div>
      </div>

      {nextBooking && (
        <div className="dash-next">
          <h3>Next Appointment</h3>
          <div className="dash-next-row">
            <div className="dash-next-field">
              <label>Customer</label>
              <span>{nextBooking.customer_name || "—"}</span>
            </div>
            <div className="dash-next-field">
              <label>Phone</label>
              <span>{nextBooking.customer_phone || "—"}</span>
            </div>
            <div className="dash-next-field">
              <label>Time</label>
              <span>{nextBooking.appointment_time || "—"}</span>
            </div>
            <div className="dash-next-field">
              <label>Package</label>
              <span>{nextBooking.package_name || "—"}</span>
            </div>
            <div className="dash-next-field">
              <label>Vehicle</label>
              <span>{nextBooking.vehicle_type_name || "—"} {nextBooking.vehicle_number ? `· ${nextBooking.vehicle_number}` : ""}</span>
            </div>
            <div className="dash-next-field">
              <label>Status</label>
              <span className={`dash-status-badge ${statusClass(nextBooking.status)}`}>{nextBooking.status}</span>
            </div>
          </div>
        </div>
      )}

      <div className="cc-table-wrap">
        <table className="cc-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Package</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {todayBookings.length === 0 ? (
              <tr><td colSpan={6} className="cc-table-empty">No appointments scheduled for today.</td></tr>
            ) : (
              todayBookings.map(b => (
                <tr key={b.booking_id}>
                  <td>{b.appointment_time}</td>
                  <td>{b.customer_name}</td>
                  <td>{b.vehicle_type_name} {b.vehicle_number ? `· ${b.vehicle_number}` : ""}</td>
                  <td>{b.package_name}</td>
                  <td><span className={`dash-status-badge ${statusClass(b.status)}`}>{b.status}</span></td>
                  <td>₹{b.payment_total || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
