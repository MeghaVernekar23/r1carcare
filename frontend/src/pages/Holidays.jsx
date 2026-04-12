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

  useEffect(() => { fetchHolidays(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null); setErr(null);
    try {
      await apiRequest({ url: `${BASE_URL}/holidays/submit`, method: "POST", data: form });
      setMsg("Holiday added.");
      setForm({ title: "", date: "" });
      setShowForm(false);
      fetchHolidays();
    } catch (e) {
      setErr(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this holiday?")) return;
    await apiRequest({ url: `${BASE_URL}/holidays/${id}`, method: "DELETE" });
    fetchHolidays();
  };

  return (
    <div>
      <div className="page-title">Holidays & Closures</div>
      <div className="page-sub">Mark dates when the wash centre is closed</div>

      {msg && <div className="cc-alert-success">{msg}</div>}
      {err && <div className="cc-alert-error">{err}</div>}

      <div className="top-actions">
        <button className="cc-btn-submit" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Holiday"}
        </button>
      </div>

      {showForm && (
        <div className="cc-form-card" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ marginBottom: "1.25rem", color: "#e2e8f0" }}>Add Holiday</h3>
          <form onSubmit={handleSubmit}>
            <div className="cc-form-row">
              <div className="cc-form-group">
                <label>Title</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Diwali" />
              </div>
              <div className="cc-form-group">
                <label>Date</label>
                <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="cc-btn-submit">Add Holiday</button>
          </form>
        </div>
      )}

      <div className="cc-table-wrap">
        <table className="cc-table">
          <thead>
            <tr><th>#</th><th>Title</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {holidays.length === 0 ? (
              <tr><td colSpan={4} className="cc-table-empty">No holidays marked.</td></tr>
            ) : (
              holidays.map(h => (
                <tr key={h.holiday_id}>
                  <td>{h.holiday_id}</td>
                  <td>{h.title}</td>
                  <td>{h.date}</td>
                  <td>
                    <button className="action-btn btn-delete" onClick={() => handleDelete(h.holiday_id)}>Remove</button>
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
