import React, { useEffect, useState } from "react";
import "../css/Dashboard.css";
import { apiRequest } from "../utils/APIrequest";
import { BASE_URL } from "../services/utils";

export default function Packages() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    apiRequest({ url: `${BASE_URL}/bookings/packages` }).then(setPackages).catch(() => {});
  }, []);

  return (
    <div>
      <div className="page-title">Wash Packages</div>
      <div className="page-sub">Available service packages</div>

      <div className="cc-table-wrap">
        <table className="cc-table">
          <thead>
            <tr><th>#</th><th>Package Name</th><th>Description</th><th>Price</th><th>Status</th></tr>
          </thead>
          <tbody>
            {packages.length === 0 ? (
              <tr><td colSpan={5} className="cc-table-empty">No packages found.</td></tr>
            ) : (
              packages.map(p => (
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
