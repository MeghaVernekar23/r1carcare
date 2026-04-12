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

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    try {
      if (editId) {
        await apiRequest({
          url: `${BASE_URL}/customers/update/${editId}`,
          method: "PUT",
          data: form,
        });
        setMsg("Customer updated.");
      } else {
        await apiRequest({ url: `${BASE_URL}/customers/submit`, method: "POST", data: form });
        setMsg("Customer added.");
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      fetchCustomers();
    } catch (error) {
      setErr(error.message);
    }
  };

  const handleEdit = (customer) => {
    setForm({
      name: customer.name,
      phone_number: customer.phone_number,
      email: customer.email || "",
      address: customer.address || "",
    });
    setEditId(customer.customer_id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    await apiRequest({ url: `${BASE_URL}/customers/delete/${id}`, method: "DELETE" });
    fetchCustomers();
  };

  return (
    <div className="page-shell">
      <section className="page-header">
        <div className="page-header-copy">
          <span className="page-eyebrow">Customer desk</span>
          <h1 className="page-title">Customer records</h1>
          <p className="page-sub">
            Manage wash customers, repeat visitors, and contact details used during booking and
            pickup.
          </p>
        </div>
        <div className="page-actions">
          <button
            className="cc-btn-submit"
            onClick={() => {
              setShowForm(!showForm);
              setEditId(null);
              setForm(emptyForm);
            }}
          >
            {showForm ? "Close form" : "Add Customer"}
          </button>
        </div>
      </section>

      {msg && <div className="cc-alert-success">{msg}</div>}
      {err && <div className="cc-alert-error">{err}</div>}

      {showForm && (
        <div className="cc-form-card">
          <div className="cc-form-card-head">
            <h3>{editId ? "Edit customer" : "Add customer"}</h3>
            <p>Store contact information cleanly so bookings can be created faster next time.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="cc-form-row">
              <div className="cc-form-group">
                <label>Full Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Customer name"
                />
              </div>
              <div className="cc-form-group">
                <label>Phone Number</label>
                <input
                  required
                  value={form.phone_number}
                  onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                  placeholder="10-digit phone"
                />
              </div>
            </div>
            <div className="cc-form-row">
              <div className="cc-form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Optional"
                />
              </div>
              <div className="cc-form-group">
                <label>Address</label>
                <input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Optional"
                />
              </div>
            </div>
            <button type="submit" className="cc-btn-submit">
              {editId ? "Update Customer" : "Save Customer"}
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
              <th>Email</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="cc-table-empty">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.customer_id}>
                  <td>{customer.customer_id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.phone_number}</td>
                  <td>{customer.email || "-"}</td>
                  <td>{customer.address || "-"}</td>
                  <td>
                    <div className="cc-inline-actions">
                      <button className="action-btn btn-edit" onClick={() => handleEdit(customer)}>
                        Edit
                      </button>
                      <button
                        className="action-btn btn-delete"
                        onClick={() => handleDelete(customer.customer_id)}
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
    </div>
  );
}
