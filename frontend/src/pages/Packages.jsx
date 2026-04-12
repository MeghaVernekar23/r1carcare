import React, { useEffect, useState } from "react";
import "../css/Dashboard.css";
import { apiRequest } from "../utils/APIrequest";
import { BASE_URL } from "../services/utils";

const EMPTY_FORM = { package_name: "", description: "", price: "", is_active: 1 };

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const fetchPackages = () => {
    apiRequest({ url: `${BASE_URL}/bookings/packages/all` }).then(setPackages).catch(() => {});
  };

  useEffect(() => { fetchPackages(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setMsg(null); setErr(null);
    try {
      await apiRequest({
        url: `${BASE_URL}/bookings/packages/add`,
        method: "POST",
        data: { ...form, price: Number(form.price) },
      });
      setMsg("Package added.");
      setForm(EMPTY_FORM);
      setShowAdd(false);
      fetchPackages();
    } catch (e) {
      setErr(e.message);
    }
  };

  const startEdit = (pkg) => {
    setEditId(pkg.package_id);
    setEditForm({ package_name: pkg.package_name, description: pkg.description || "", price: pkg.price, is_active: pkg.is_active });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setMsg(null); setErr(null);
    try {
      await apiRequest({
        url: `${BASE_URL}/bookings/packages/update/${editId}`,
        method: "PUT",
        data: { ...editForm, price: Number(editForm.price) },
      });
      setMsg("Package updated.");
      setEditId(null);
      fetchPackages();
    } catch (e) {
      setErr(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this package?")) return;
    setMsg(null); setErr(null);
    try {
      await apiRequest({ url: `${BASE_URL}/bookings/packages/delete/${id}`, method: "DELETE" });
      setMsg("Package deleted.");
      fetchPackages();
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div>
      <div className="page-title">Wash Packages</div>
      <div className="page-sub">Available service packages</div>

      {msg && <div className="cc-alert-success">{msg}</div>}
      {err && <div className="cc-alert-error">{err}</div>}

      <div className="top-actions">
        <button className="cc-btn-submit" onClick={() => { setShowAdd(!showAdd); setEditId(null); }}>
          {showAdd ? "Cancel" : "+ Add Package"}
        </button>
      </div>

      {showAdd && (
        <div className="cc-form-card" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ marginBottom: "1.25rem", color: "#e2e8f0" }}>Add Package</h3>
          <form onSubmit={handleAdd}>
            <div className="cc-form-row">
              <div className="cc-form-group">
                <label>Package Name</label>
                <input required value={form.package_name} onChange={e => setForm({ ...form, package_name: e.target.value })} placeholder="e.g. Premium Wash" />
              </div>
              <div className="cc-form-group">
                <label>Price (₹)</label>
                <input required type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="e.g. 500" />
              </div>
            </div>
            <div className="cc-form-row">
              <div className="cc-form-group">
                <label>Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
              </div>
              <div className="cc-form-group">
                <label>Status</label>
                <select value={form.is_active} onChange={e => setForm({ ...form, is_active: Number(e.target.value) })}>
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
            </div>
            <button type="submit" className="cc-btn-submit">Add Package</button>
          </form>
        </div>
      )}

      <div className="cc-table-wrap">
        <table className="cc-table">
          <thead>
            <tr><th>#</th><th>Package Name</th><th>Description</th><th>Price</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {packages.length === 0 ? (
              <tr><td colSpan={6} className="cc-table-empty">No packages found.</td></tr>
            ) : (
              packages.map(p => editId === p.package_id ? (
                <tr key={p.package_id}>
                  <td>{p.package_id}</td>
                  <td><input value={editForm.package_name} onChange={e => setEditForm({ ...editForm, package_name: e.target.value })} style={{ width: "100%" }} /></td>
                  <td><input value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} style={{ width: "100%" }} /></td>
                  <td><input type="number" min="0" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} style={{ width: "80px" }} /></td>
                  <td>
                    <select value={editForm.is_active} onChange={e => setEditForm({ ...editForm, is_active: Number(e.target.value) })}>
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </td>
                  <td style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="action-btn btn-edit" onClick={handleEdit}>Save</button>
                    <button className="action-btn btn-delete" onClick={() => setEditId(null)}>Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={p.package_id}>
                  <td>{p.package_id}</td>
                  <td style={{ fontWeight: 600 }}>{p.package_name}</td>
                  <td>{p.description}</td>
                  <td>₹{p.price}</td>
                  <td>
                    <span className={`dash-status-badge ${p.is_active ? "badge-confirmed" : "badge-cancelled"}`}>
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="action-btn btn-edit" onClick={() => { startEdit(p); setShowAdd(false); }}>Edit</button>
                    <button className="action-btn btn-delete" onClick={() => handleDelete(p.package_id)}>Delete</button>
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
