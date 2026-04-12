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
      .then(setTodayBookings)
      .catch(() => {});
    apiRequest({ url: `${BASE_URL}/bookings/by-filter?filter=upcoming` })
      .then(setUpcomingBookings)
      .catch(() => {});
    apiRequest({ url: `${BASE_URL}/bookings/next-booking` })
      .then(setNextBooking)
      .catch(() => {});
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

  const revenueToday = todayBookings.reduce((sum, booking) => sum + (booking.payment_paid || 0), 0);
  const pendingPayments = todayBookings.filter(
    (booking) => (booking.payment_paid || 0) < (booking.payment_total || 0)
  ).length;

  return (
    <div className="dash-page page-shell">
      <section className="page-header page-header--dashboard">
        <div className="page-header-copy">
          <span className="page-eyebrow">Operations overview</span>
          <h1 className="page-title">Wash bay dashboard</h1>
          <p className="page-sub">
            Welcome back, {user.username || "Staff"}. Track today&apos;s bookings, payment status,
            and the next vehicle arriving at the wash bay.
          </p>
        </div>
      </section>

      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-card-label">Today&apos;s Appointments</div>
          <div className="dash-card-value">{todayBookings.length}</div>
          <div className="dash-card-sub">Scheduled for the current day</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label">Upcoming Queue</div>
          <div className="dash-card-value">{upcomingBookings.length}</div>
          <div className="dash-card-sub">Future wash bookings</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label">Pending Payments</div>
          <div className="dash-card-value">{pendingPayments}</div>
          <div className="dash-card-sub">Today&apos;s unpaid or partial jobs</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label">Revenue Today</div>
          <div className="dash-card-value">Rs {revenueToday}</div>
          <div className="dash-card-sub">Collected from completed wash payments</div>
        </div>
      </div>

      {nextBooking && (
        <div className="dash-next">
          <h3>Next appointment</h3>
          <div className="dash-next-row">
            <div className="dash-next-field">
              <label>Customer</label>
              <span>{nextBooking.customer_name || "-"}</span>
            </div>
            <div className="dash-next-field">
              <label>Phone</label>
              <span>{nextBooking.customer_phone || "-"}</span>
            </div>
            <div className="dash-next-field">
              <label>Time</label>
              <span>{nextBooking.appointment_time || "-"}</span>
            </div>
            <div className="dash-next-field">
              <label>Package</label>
              <span>{nextBooking.package_name || "-"}</span>
            </div>
            <div className="dash-next-field">
              <label>Vehicle</label>
              <span>
                {nextBooking.vehicle_type_name || "-"}
                {nextBooking.vehicle_number ? ` | ${nextBooking.vehicle_number}` : ""}
              </span>
            </div>
            <div className="dash-next-field">
              <label>Status</label>
              <span className={`dash-status-badge ${statusClass(nextBooking.status)}`}>
                {nextBooking.status}
              </span>
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
              <tr>
                <td colSpan={6} className="cc-table-empty">
                  No appointments scheduled for today.
                </td>
              </tr>
            ) : (
              todayBookings.map((booking) => (
                <tr key={booking.booking_id}>
                  <td>{booking.appointment_time}</td>
                  <td>{booking.customer_name}</td>
                  <td>
                    {booking.vehicle_type_name}
                    {booking.vehicle_number ? ` | ${booking.vehicle_number}` : ""}
                  </td>
                  <td>{booking.package_name}</td>
                  <td>
                    <span className={`dash-status-badge ${statusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>Rs {booking.payment_total || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
