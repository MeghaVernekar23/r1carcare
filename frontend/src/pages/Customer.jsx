import React, { useEffect, useState } from "react";
import "../css/Dashboard.css";
import { apiRequest } from "../utils/APIrequest";
import { BASE_URL } from "../services/utils";

const emptyForm = { name: "", phone_number: "", email: "", address: "" };

export default function CustomerDetails() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const fetchCustomers = () => {
    apiRequest({ url: `${BASE_URL}/customers/` }).then(setCustomers).catch(() => {});
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null); setErr(null);
    try {
      if (editId) {
        await apiRequest({ url: `${BASE_URL}/customers/update/${editId}`, method: "PUT", data: form });
        setMsg("Customer updated.");
      } else {
        await apiRequest({ url: `${BASE_URL}/customers/submit`, method: "POST", data: form });
        setMsg("Customer added.");
      }
      setForm(emptyForm); setEditId(null); setShowForm(false);
      fetchCustomers();
    } catch (e) {
      setErr(e.message);
    }
  };

  const handleEdit = (c) => {
    setForm({ name: c.name, phone_number: c.phone_number, email: c.email || "", address: c.address || "" });
    setEditId(c.customer_id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    await apiRequest({ url: `${BASE_URL}/customers/delete/${id}`, method: "DELETE" });
    fetchCustomers();
  };

  return (
    <div>
      <div className="page-title">Customers</div>
      <div className="page-sub">Manage customer records</div>

      {msg && <div className="cc-alert-success">{msg}</div>}
      {err && <div className="cc-alert-error">{err}</div>}

      <div className="top-actions">
        <button className="cc-btn-submit" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}>
          {showForm ? "Cancel" : "+ Add Customer"}
        </button>
      </div>

      {showForm && (
        <div className="cc-form-card" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ marginBottom: "1.25rem", color: "#e2e8f0" }}>{editId ? "Edit Customer" : "Add Customer"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="cc-form-row">
              <div className="cc-form-group">
                <label>Full Name</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Customer name" />
              </div>
              <div className="cc-form-group">
                <label>Phone Number</label>
                <input required value={form.phone_number} onChange={e => setForm({ ...form, phone_number: e.target.value })} placeholder="10-digit phone" />
              </div>
            </div>
            <div className="cc-form-row">
              <div className="cc-form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Optional" />
              </div>
              <div className="cc-form-group">
                <label>Address</label>
                <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Optional" />
              </div>
            </div>
            <button type="submit" className="cc-btn-submit">{editId ? "Update" : "Add Customer"}</button>
          </form>
        </div>
      )}

      <div className="cc-table-wrap">
        <table className="cc-table">
          <thead>
            <tr><th>#</th><th>Name</th><th>Phone</th><th>Email</th><th>Address</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan={6} className="cc-table-empty">No customers found.</td></tr>
            ) : (
              customers.map(c => (
                <tr key={c.customer_id}>
                  <td>{c.customer_id}</td>
                  <td>{c.name}</td>
                  <td>{c.phone_number}</td>
                  <td>{c.email || "—"}</td>
                  <td>{c.address || "—"}</td>
                  <td>
                    <button className="action-btn btn-edit" onClick={() => handleEdit(c)}>Edit</button>
                    <button className="action-btn btn-delete" onClick={() => handleDelete(c.customer_id)}>Delete</button>
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
