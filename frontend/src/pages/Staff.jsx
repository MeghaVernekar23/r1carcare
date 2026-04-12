import React, { useEffect, useState } from "react";
import "../css/Dashboard.css";
import { apiRequest } from "../utils/APIrequest";
import { BASE_URL } from "../services/utils";

const emptyForm = { name: "", phone_number: "", role: "", status: "active" };

export default function StaffDetails() {
  const [staffList, setStaffList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  // Holiday panel state
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [holidayForm, setHolidayForm] = useState({ date: "", reason: "" });
  const [holidayMsg, setHolidayMsg] = useState(null);
  const [holidayErr, setHolidayErr] = useState(null);

  const fetchStaff = () => {
    apiRequest({ url: `${BASE_URL}/staff/` }).then(setStaffList).catch(() => {});
  };

  useEffect(() => { fetchStaff(); }, []);

  const fetchHolidays = (staffId) => {
    apiRequest({ url: `${BASE_URL}/staff/${staffId}/holidays` })
      .then(setHolidays)
      .catch(() => setHolidays([]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null); setErr(null);
    try {
      if (editId) {
        await apiRequest({ url: `${BASE_URL}/staff/update/${editId}`, method: "PUT", data: form });
        setMsg("Staff member updated.");
      } else {
        await apiRequest({ url: `${BASE_URL}/staff/add`, method: "POST", data: form });
        setMsg("Staff member added.");
      }
      setForm(emptyForm); setEditId(null); setShowForm(false);
      fetchStaff();
    } catch (e) { setErr(e.message); }
  };

  const handleEdit = (s) => {
    setForm({ name: s.name, phone_number: s.phone_number || "", role: s.role || "", status: s.status });
    setEditId(s.staff_id);
    setShowForm(true);
    setSelectedStaff(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this staff member? This will also remove their holiday records.")) return;
    try {
      await apiRequest({ url: `${BASE_URL}/staff/delete/${id}`, method: "DELETE" });
      if (selectedStaff?.staff_id === id) setSelectedStaff(null);
      fetchStaff();
    } catch (e) { setErr(e.message); }
  };

  const openHolidays = (s) => {
    setSelectedStaff(s);
    setHolidayMsg(null); setHolidayErr(null);
    setHolidayForm({ date: "", reason: "" });
    fetchHolidays(s.staff_id);
    setShowForm(false);
  };

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    setHolidayMsg(null); setHolidayErr(null);
    try {
      await apiRequest({
        url: `${BASE_URL}/staff/holidays/add`, method: "POST",
        data: { staff_id: selectedStaff.staff_id, date: holidayForm.date, reason: holidayForm.reason || null },
      });
      setHolidayMsg("Holiday added.");
      setHolidayForm({ date: "", reason: "" });
      fetchHolidays(selectedStaff.staff_id);
    } catch (e) { setHolidayErr(e.message); }
  };

  const handleDeleteHoliday = async (id) => {
    try {
      await apiRequest({ url: `${BASE_URL}/staff/holidays/delete/${id}`, method: "DELETE" });
      fetchHolidays(selectedStaff.staff_id);
    } catch (e) { setHolidayErr(e.message); }
  };

  return (
    <div>
      <div className="page-title">Staff</div>
      <div className="page-sub">Manage staff members, their status, and holiday records</div>

      {msg && <div className="cc-alert-success">{msg}</div>}
      {err && <div className="cc-alert-error">{err}</div>}

      <div className="top-actions">
        <button className="cc-btn-submit" onClick={() => {
          setShowForm(!showForm); setEditId(null); setForm(emptyForm); setSelectedStaff(null);
        }}>
          {showForm ? "Cancel" : "+ Add Staff"}
        </button>
      </div>

      {showForm && (
        <div className="cc-form-card" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ marginBottom: "1.25rem" }}>{editId ? "Edit Staff Member" : "Add Staff Member"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="cc-form-row">
              <div className="cc-form-group">
                <label>Full Name *</label>
                <input required value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Staff name" />
              </div>
              <div className="cc-form-group">
                <label>Phone Number</label>
                <input value={form.phone_number}
                  onChange={e => setForm({ ...form, phone_number: e.target.value })} placeholder="10-digit phone" />
              </div>
            </div>
            <div className="cc-form-row">
              <div className="cc-form-group">
                <label>Role</label>
                <input value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. Attendant, Manager" />
              </div>
              <div className="cc-form-group">
                <label>Status *</label>
                <select required value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <button type="submit" className="cc-btn-submit">
              {editId ? "Update Staff" : "Add Staff"}
            </button>
          </form>
        </div>
      )}

      <div className="cc-table-wrap" style={{ marginBottom: selectedStaff ? "1.5rem" : 0 }}>
        <table className="cc-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.length === 0 ? (
              <tr><td colSpan={6} className="cc-table-empty">No staff members found.</td></tr>
            ) : (
              staffList.map(s => (
                <tr key={s.staff_id} style={selectedStaff?.staff_id === s.staff_id ? { background: "#eff6ff" } : {}}>
                  <td>{s.staff_id}</td>
                  <td>{s.name}</td>
                  <td>{s.phone_number || "—"}</td>
                  <td>{s.role || "—"}</td>
                  <td>
                    <span style={{
                      padding: "2px 10px", borderRadius: 20, fontSize: ".78rem", fontWeight: 700,
                      background: s.status === "active" ? "#dcfce7" : "#f1f5f9",
                      color: s.status === "active" ? "#16a34a" : "#64748b",
                    }}>
                      {s.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    <button className="action-btn btn-edit" onClick={() => handleEdit(s)}>Edit</button>
                    <button className="action-btn"
                      style={{ background: "#f0fdf4", color: "#16a34a" }}
                      onClick={() => openHolidays(s)}>
                      Holidays
                    </button>
                    <button className="action-btn btn-delete" onClick={() => handleDelete(s.staff_id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedStaff && (
        <div className="cc-form-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 style={{ margin: 0 }}>Holidays — {selectedStaff.name}</h3>
            <button className="action-btn btn-delete" onClick={() => setSelectedStaff(null)}>✕ Close</button>
          </div>

          {holidayMsg && <div className="cc-alert-success">{holidayMsg}</div>}
          {holidayErr && <div className="cc-alert-error">{holidayErr}</div>}

          <form onSubmit={handleAddHoliday} style={{ marginBottom: "1.25rem" }}>
            <div className="cc-form-row">
              <div className="cc-form-group">
                <label>Date *</label>
                <input required type="date" value={holidayForm.date}
                  onChange={e => setHolidayForm({ ...holidayForm, date: e.target.value })} />
              </div>
              <div className="cc-form-group">
                <label>Reason</label>
                <input value={holidayForm.reason}
                  onChange={e => setHolidayForm({ ...holidayForm, reason: e.target.value })}
                  placeholder="e.g. Sick leave, Personal" />
              </div>
            </div>
            <button type="submit" className="cc-btn-submit">+ Add Holiday</button>
          </form>

          {holidays.length === 0 ? (
            <p style={{ color: "#94a3b8", fontSize: ".88rem" }}>No holidays recorded for this staff member.</p>
          ) : (
            <div className="cc-table-wrap">
              <table className="cc-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Reason</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {holidays.map(h => (
                    <tr key={h.id}>
                      <td>{h.date}</td>
                      <td>{h.reason || "—"}</td>
                      <td>
                        <button className="action-btn btn-delete" onClick={() => handleDeleteHoliday(h.id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
