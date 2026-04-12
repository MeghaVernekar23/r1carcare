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

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);
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
    } catch (error) {
      setErr(error.message);
    }
  };

  const startEdit = (pkg) => {
    setEditId(pkg.package_id);
    setEditForm({
      package_name: pkg.package_name,
      description: pkg.description || "",
      price: pkg.price,
      is_active: pkg.is_active,
    });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    try {
      await apiRequest({
        url: `${BASE_URL}/bookings/packages/update/${editId}`,
        method: "PUT",
        data: { ...editForm, price: Number(editForm.price) },
      });
      setMsg("Package updated.");
      setEditId(null);
      fetchPackages();
    } catch (error) {
      setErr(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this package?")) return;
    setMsg(null);
    setErr(null);
    try {
      await apiRequest({ url: `${BASE_URL}/bookings/packages/delete/${id}`, method: "DELETE" });
      setMsg("Package deleted.");
      fetchPackages();
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <div className="page-shell">
      <section className="page-header">
        <div className="page-header-copy">
          <span className="page-eyebrow">Service catalog</span>
          <h1 className="page-title">Wash packages</h1>
          <p className="page-sub">
            Keep the public booking flow clear by managing active packages, pricing, and package
            descriptions here.
          </p>
        </div>
        <div className="page-actions">
          <button
            className="cc-btn-submit"
            onClick={() => {
              setShowAdd(!showAdd);
              setEditId(null);
            }}
          >
            {showAdd ? "Close form" : "Add Package"}
          </button>
        </div>
      </section>

      {msg && <div className="cc-alert-success">{msg}</div>}
      {err && <div className="cc-alert-error">{err}</div>}

      {showAdd && (
        <div className="cc-form-card">
          <div className="cc-form-card-head">
            <h3>Add package</h3>
            <p>Create a wash tier that can be assigned in staff bookings and public reservations.</p>
          </div>
          <form onSubmit={handleAdd}>
            <div className="cc-form-row">
              <div className="cc-form-group">
                <label>Package Name</label>
                <input
                  required
                  value={form.package_name}
                  onChange={(e) => setForm({ ...form, package_name: e.target.value })}
                  placeholder="e.g. Premium Wash"
                />
              </div>
              <div className="cc-form-group">
                <label>Price</label>
                <input
                  required
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. 500"
                />
              </div>
            </div>
            <div className="cc-form-row">
              <div className="cc-form-group">
                <label>Description</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>
              <div className="cc-form-group">
                <label>Status</label>
                <select
                  value={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: Number(e.target.value) })}
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
            </div>
            <button type="submit" className="cc-btn-submit">
              Save Package
            </button>
          </form>
        </div>
      )}

      <div className="cc-table-wrap">
        <table className="cc-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Package Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.length === 0 ? (
              <tr>
                <td colSpan={6} className="cc-table-empty">
                  No packages found.
                </td>
              </tr>
            ) : (
              packages.map((pkg) =>
                editId === pkg.package_id ? (
                  <tr key={pkg.package_id}>
                    <td>{pkg.package_id}</td>
                    <td>
                      <input
                        className="cc-table-input"
                        value={editForm.package_name}
                        onChange={(e) => setEditForm({ ...editForm, package_name: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="cc-table-input"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="cc-table-input"
                        type="number"
                        min="0"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      />
                    </td>
                    <td>
                      <select
                        className="cc-table-select"
                        value={editForm.is_active}
                        onChange={(e) => setEditForm({ ...editForm, is_active: Number(e.target.value) })}
                      >
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </td>
                    <td>
                      <div className="cc-inline-actions">
                        <button className="action-btn btn-edit" onClick={handleEdit}>
                          Save
                        </button>
                        <button className="action-btn btn-delete" onClick={() => setEditId(null)}>
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={pkg.package_id}>
                    <td>{pkg.package_id}</td>
                    <td>{pkg.package_name}</td>
                    <td>{pkg.description || "-"}</td>
                    <td>Rs {pkg.price}</td>
                    <td>
                      <span className={`dash-status-badge ${pkg.is_active ? "badge-confirmed" : "badge-cancelled"}`}>
                        {pkg.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="cc-inline-actions">
                        <button
                          className="action-btn btn-edit"
                          onClick={() => {
                            startEdit(pkg);
                            setShowAdd(false);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="action-btn btn-delete"
                          onClick={() => handleDelete(pkg.package_id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
