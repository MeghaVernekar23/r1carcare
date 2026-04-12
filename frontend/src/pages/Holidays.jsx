import React, { useEffect, useState } from "react";
import "../css/Dashboard.css";
import { apiRequest } from "../utils/APIrequest";
import { BASE_URL } from "../services/utils";

export default function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", date: "" });
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const fetchHolidays = () => {
    apiRequest({ url: `${BASE_URL}/holidays/` }).then(setHolidays).catch(() => {});
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    try {
      await apiRequest({ url: `${BASE_URL}/holidays/submit`, method: "POST", data: form });
      setMsg("Holiday added.");
      setForm({ title: "", date: "" });
      setShowForm(false);
      fetchHolidays();
    } catch (error) {
      setErr(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this holiday?")) return;
    await apiRequest({ url: `${BASE_URL}/holidays/${id}`, method: "DELETE" });
    fetchHolidays();
  };

  return (
    <div className="page-shell">
      <section className="page-header">
        <div className="page-header-copy">
          <span className="page-eyebrow">Closures</span>
          <h1 className="page-title">Holidays and closures</h1>
          <p className="page-sub">
            Mark dates when the wash center is unavailable so the booking calendar stays accurate.
          </p>
        </div>
        <div className="page-actions">
          <button className="cc-btn-submit" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Close form" : "Add Holiday"}
          </button>
        </div>
      </section>

      {msg && <div className="cc-alert-success">{msg}</div>}
      {err && <div className="cc-alert-error">{err}</div>}

      {showForm && (
        <div className="cc-form-card">
          <div className="cc-form-card-head">
            <h3>Add closure date</h3>
            <p>Use this for public holidays, maintenance days, or any planned wash center closure.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="cc-form-row">
              <div className="cc-form-group">
                <label>Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Diwali"
                />
              </div>
              <div className="cc-form-group">
                <label>Date</label>
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="cc-btn-submit">
              Save Holiday
            </button>
          </form>
        </div>
      )}

      <div className="cc-table-wrap">
        <table className="cc-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {holidays.length === 0 ? (
              <tr>
                <td colSpan={4} className="cc-table-empty">
                  No holidays marked.
                </td>
              </tr>
            ) : (
              holidays.map((holiday) => (
                <tr key={holiday.holiday_id}>
                  <td>{holiday.holiday_id}</td>
                  <td>{holiday.title}</td>
                  <td>{holiday.date}</td>
                  <td>
                    <button
                      className="action-btn btn-delete"
                      onClick={() => handleDelete(holiday.holiday_id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
