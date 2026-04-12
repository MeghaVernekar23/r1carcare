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
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [holidayForm, setHolidayForm] = useState({ date: "", reason: "" });
  const [holidayMsg, setHolidayMsg] = useState(null);
  const [holidayErr, setHolidayErr] = useState(null);

  const fetchStaff = () => {
    apiRequest({ url: `${BASE_URL}/staff/` }).then(setStaffList).catch(() => {});
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchHolidays = (staffId) => {
    apiRequest({ url: `${BASE_URL}/staff/${staffId}/holidays` })
      .then(setHolidays)
      .catch(() => setHolidays([]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    try {
      if (editId) {
        await apiRequest({ url: `${BASE_URL}/staff/update/${editId}`, method: "PUT", data: form });
        setMsg("Staff member updated.");
      } else {
        await apiRequest({ url: `${BASE_URL}/staff/add`, method: "POST", data: form });
        setMsg("Staff member added.");
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      fetchStaff();
    } catch (error) {
      setErr(error.message);
    }
  };

  const handleEdit = (staff) => {
    setForm({
      name: staff.name,
      phone_number: staff.phone_number || "",
      role: staff.role || "",
      status: staff.status,
    });
    setEditId(staff.staff_id);
    setShowForm(true);
    setSelectedStaff(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this staff member? This will also remove their holiday records.")) {
      return;
    }
    try {
      await apiRequest({ url: `${BASE_URL}/staff/delete/${id}`, method: "DELETE" });
      if (selectedStaff?.staff_id === id) setSelectedStaff(null);
      fetchStaff();
    } catch (error) {
      setErr(error.message);
    }
  };

  const openHolidays = (staff) => {
    setSelectedStaff(staff);
    setHolidayMsg(null);
    setHolidayErr(null);
    setHolidayForm({ date: "", reason: "" });
    fetchHolidays(staff.staff_id);
    setShowForm(false);
  };

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    setHolidayMsg(null);
    setHolidayErr(null);
    try {
      await apiRequest({
        url: `${BASE_URL}/staff/holidays/add`,
        method: "POST",
        data: {
          staff_id: selectedStaff.staff_id,
          date: holidayForm.date,
          reason: holidayForm.reason || null,
        },
      });
      setHolidayMsg("Holiday added.");
      setHolidayForm({ date: "", reason: "" });
      fetchHolidays(selectedStaff.staff_id);
    } catch (error) {
      setHolidayErr(error.message);
    }
  };

  const handleDeleteHoliday = async (id) => {
    try {
      await apiRequest({ url: `${BASE_URL}/staff/holidays/delete/${id}`, method: "DELETE" });
      fetchHolidays(selectedStaff.staff_id);
    } catch (error) {
      setHolidayErr(error.message);
    }
  };

  return (
    <div className="page-shell">
      <section className="page-header">
        <div className="page-header-copy">
          <span className="page-eyebrow">Team management</span>
          <h1 className="page-title">Staff and holidays</h1>
          <p className="page-sub">
            Maintain the active team roster, assign wash roles, and record days when staff are not
            available.
          </p>
        </div>
        <div className="page-actions">
          <button
            className="cc-btn-submit"
            onClick={() => {
              setShowForm(!showForm);
              setEditId(null);
              setForm(emptyForm);
              setSelectedStaff(null);
            }}
          >
            {showForm ? "Close form" : "Add Staff"}
          </button>
        </div>
      </section>

      {msg && <div className="cc-alert-success">{msg}</div>}
      {err && <div className="cc-alert-error">{err}</div>}

      {showForm && (
        <div className="cc-form-card">
          <div className="cc-form-card-head">
            <h3>{editId ? "Edit staff member" : "Add staff member"}</h3>
            <p>Assign clear roles so booking allocation and wash-bay scheduling stay predictable.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="cc-form-row">
              <div className="cc-form-group">
                <label>Full Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Staff name"
                />
              </div>
              <div className="cc-form-group">
                <label>Phone Number</label>
                <input
                  value={form.phone_number}
                  onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                  placeholder="10-digit phone"
                />
              </div>
            </div>
            <div className="cc-form-row">
              <div className="cc-form-group">
                <label>Role</label>
                <input
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g. Attendant, Manager"
                />
              </div>
              <div className="cc-form-group">
                <label>Status</label>
                <select
                  required
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <button type="submit" className="cc-btn-submit">
              {editId ? "Update Staff" : "Save Staff"}
            </button>
          </form>
        </div>
      )}

      <div className="cc-table-wrap">
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
              <tr>
                <td colSpan={6} className="cc-table-empty">
                  No staff members found.
                </td>
              </tr>
            ) : (
              staffList.map((staff) => (
                <tr key={staff.staff_id}>
                  <td>{staff.staff_id}</td>
                  <td>{staff.name}</td>
                  <td>{staff.phone_number || "-"}</td>
                  <td>{staff.role || "-"}</td>
                  <td>
                    <span
                      className={`dash-status-badge ${staff.status === "active" ? "badge-confirmed" : "badge-cancelled"}`}
                    >
                      {staff.status}
                    </span>
                  </td>
                  <td>
                    <div className="cc-inline-actions">
                      <button className="action-btn btn-edit" onClick={() => handleEdit(staff)}>
                        Edit
                      </button>
                      <button className="action-btn btn-view" onClick={() => openHolidays(staff)}>
                        Holidays
                      </button>
                      <button
                        className="action-btn btn-delete"
                        onClick={() => handleDelete(staff.staff_id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedStaff && (
        <div className="cc-form-card">
          <div className="cc-form-card-head">
            <h3>{selectedStaff.name} holiday calendar</h3>
            <p>Add closures or leave dates so the system can avoid assigning unavailable staff.</p>
          </div>

          {holidayMsg && <div className="cc-alert-success">{holidayMsg}</div>}
          {holidayErr && <div className="cc-alert-error">{holidayErr}</div>}

          <form onSubmit={handleAddHoliday}>
            <div className="cc-form-row">
              <div className="cc-form-group">
                <label>Date</label>
                <input
                  required
                  type="date"
                  value={holidayForm.date}
                  onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })}
                />
              </div>
              <div className="cc-form-group">
                <label>Reason</label>
                <input
                  value={holidayForm.reason}
                  onChange={(e) => setHolidayForm({ ...holidayForm, reason: e.target.value })}
                  placeholder="e.g. Sick leave, Personal"
                />
              </div>
            </div>
            <div className="page-actions" style={{ justifyContent: "space-between", marginBottom: "18px" }}>
              <button type="submit" className="cc-btn-submit">
                Add Holiday
              </button>
              <button className="action-btn btn-delete" type="button" onClick={() => setSelectedStaff(null)}>
                Close
              </button>
            </div>
          </form>

          {holidays.length === 0 ? (
            <p className="page-inline-note">No holidays recorded for this staff member.</p>
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
                  {holidays.map((holiday) => (
                    <tr key={holiday.id}>
                      <td>{holiday.date}</td>
                      <td>{holiday.reason || "-"}</td>
                      <td>
                        <button
                          className="action-btn btn-delete"
                          onClick={() => handleDeleteHoliday(holiday.id)}
                        >
                          Remove
                        </button>
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
