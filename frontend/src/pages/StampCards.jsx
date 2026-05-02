import React, { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../utils/APIrequest";
import { BASE_URL } from "../services/utils";
import "../css/StampCards.css";

const DEFAULT_ISSUE = { total_washes: 10, price_paid: 4000, notes: "" };

function StampDots({ total, used }) {
  return (
    <div className="sc-stamps">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`sc-dot${i < used ? " sc-dot--used" : ""}`}>
          {i < used && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

export default function StampCards() {
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState(null);
  const [card, setCard] = useState(undefined); // undefined = not searched yet, null = no card
  const [allCards, setAllCards] = useState([]);
  const [searchErr, setSearchErr] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);
  const [actionErr, setActionErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issueForm, setIssueForm] = useState(DEFAULT_ISSUE);

  const fetchAllCards = useCallback(async () => {
    try {
      const data = await apiRequest({ url: `${BASE_URL}/stamp-cards/` });
      setAllCards(data);
    } catch {}
  }, []);

  useEffect(() => { fetchAllCards(); }, [fetchAllCards]);

  const refreshCard = useCallback(async (customerId) => {
    const sc = await apiRequest({ url: `${BASE_URL}/stamp-cards/by-customer/${customerId}` });
    setCard(sc);
  }, []);

  const searchCustomer = async () => {
    const trimmed = phone.trim();
    if (trimmed.length < 10) return;
    setSearchErr(null);
    setCustomer(null);
    setCard(undefined);
    setActionMsg(null);
    setActionErr(null);
    setShowIssueForm(false);
    try {
      const c = await apiRequest({ url: `${BASE_URL}/customers/details/${trimmed}` });
      setCustomer(c);
      await refreshCard(c.customer_id);
    } catch {
      setSearchErr("No customer found with this phone number.");
    }
  };

  const recordWash = async () => {
    if (!card) return;
    setLoading(true);
    setActionMsg(null);
    setActionErr(null);
    try {
      const res = await apiRequest({
        url: `${BASE_URL}/stamp-cards/${card.card_id}/record-wash`,
        method: "POST",
      });
      setActionMsg(res.message + (res.free_wash_earned ? " Free wash earned!" : ""));
      await refreshCard(customer.customer_id);
      fetchAllCards();
    } catch (e) {
      setActionErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const useFreeWash = async () => {
    if (!card) return;
    setLoading(true);
    setActionMsg(null);
    setActionErr(null);
    try {
      const res = await apiRequest({
        url: `${BASE_URL}/stamp-cards/${card.card_id}/use-free-wash`,
        method: "POST",
      });
      setActionMsg(res.message);
      await refreshCard(customer.customer_id);
      fetchAllCards();
    } catch (e) {
      setActionErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const issueCard = async () => {
    if (!customer) return;
    setLoading(true);
    setActionMsg(null);
    setActionErr(null);
    try {
      const res = await apiRequest({
        url: `${BASE_URL}/stamp-cards/purchase`,
        method: "POST",
        data: { customer_id: customer.customer_id, ...issueForm },
      });
      setActionMsg(res.message);
      setShowIssueForm(false);
      setIssueForm(DEFAULT_ISSUE);
      await refreshCard(customer.customer_id);
      fetchAllCards();
    } catch (e) {
      setActionErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const selectCardFromTable = (c) => {
    setPhone(c.customer_phone || "");
    setCustomer({ customer_id: c.customer_id, name: c.customer_name, phone_number: c.customer_phone });
    setCard(c);
    setActionMsg(null);
    setActionErr(null);
    setShowIssueForm(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const canRecordWash = card && card.status === "active" && card.washes_remaining > 0;
  const canUseFreeWash = card && card.free_wash_earned && !card.free_wash_used;
  const cardFullyDone = card && card.free_wash_used;

  return (
    <div className="sc-page">
      <div className="sc-page-header">
        <h1>Stamp Cards</h1>
        <p>Annual wash packages — 10 washes · 12-month validity · Free wash on completion</p>
      </div>

      {/* Search */}
      <div className="sc-search-box">
        <div className="sc-search-row">
          <input
            className="sc-search-input"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            onKeyDown={e => e.key === "Enter" && searchCustomer()}
            placeholder="Search customer by phone number…"
          />
          <button className="sc-btn-primary" onClick={searchCustomer}>Search</button>
        </div>
        {searchErr && <div className="sc-alert sc-alert--error">{searchErr}</div>}
      </div>

      {/* Customer + card section */}
      {customer && (
        <div className="sc-customer-section">
          <div className="sc-customer-bar">
            <div className="sc-customer-info">
              <span className="sc-customer-name">{customer.name}</span>
              <span className="sc-customer-phone">{customer.phone_number}</span>
            </div>
            {(card === null || cardFullyDone) && !showIssueForm && (
              <button className="sc-btn-primary" onClick={() => setShowIssueForm(true)}>
                + Issue Stamp Card
              </button>
            )}
          </div>

          {actionMsg && <div className="sc-alert sc-alert--success">{actionMsg}</div>}
          {actionErr && <div className="sc-alert sc-alert--error">{actionErr}</div>}

          {showIssueForm && (
            <div className="sc-issue-form">
              <h3>Issue New Stamp Card</h3>
              <div className="sc-form-grid">
                <div className="sc-form-field">
                  <label>Total Washes</label>
                  <input
                    type="number" min="1"
                    value={issueForm.total_washes}
                    onChange={e => setIssueForm({ ...issueForm, total_washes: parseInt(e.target.value) || 10 })}
                  />
                </div>
                <div className="sc-form-field">
                  <label>Price Paid (₹)</label>
                  <input
                    type="number" min="0"
                    value={issueForm.price_paid}
                    onChange={e => setIssueForm({ ...issueForm, price_paid: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="sc-form-field">
                <label>Notes <span className="sc-optional">(optional)</span></label>
                <input
                  value={issueForm.notes}
                  onChange={e => setIssueForm({ ...issueForm, notes: e.target.value })}
                  placeholder="e.g. customer paid cash"
                />
              </div>
              <div className="sc-form-actions">
                <button className="sc-btn-primary" onClick={issueCard} disabled={loading}>
                  {loading ? "Issuing…" : "Issue Card"}
                </button>
                <button className="sc-btn-ghost" onClick={() => setShowIssueForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          {card ? (
            <div className="sc-card">
              <div className="sc-card-top">
                <div>
                  <div className="sc-card-title">Wash Stamp Card</div>
                  <div className="sc-card-meta">
                    Valid until {card.expiry_date} &nbsp;·&nbsp; ₹{card.price_paid}
                  </div>
                </div>
                <span className={`sc-status sc-status--${card.status}`}>{card.status.toUpperCase()}</span>
              </div>

              <StampDots total={card.total_washes} used={card.washes_used} />

              <div className="sc-card-stats">
                <div className="sc-stat">
                  <div className="sc-stat-num">{card.washes_used}</div>
                  <div className="sc-stat-label">Used</div>
                </div>
                <div className="sc-stat">
                  <div className="sc-stat-num sc-stat-num--highlight">{card.washes_remaining}</div>
                  <div className="sc-stat-label">Remaining</div>
                </div>
                <div className="sc-stat">
                  <div className="sc-stat-num">{card.total_washes}</div>
                  <div className="sc-stat-label">Total</div>
                </div>
              </div>

              {canUseFreeWash && (
                <div className="sc-banner sc-banner--free">
                  All {card.total_washes} washes done — free wash earned!
                </div>
              )}
              {card.free_wash_used && (
                <div className="sc-banner sc-banner--done">
                  Free wash redeemed. Card fully used.
                </div>
              )}
              {card.birthday_box_discount && (
                <div className="sc-banner sc-banner--birthday">
                  50% off at BirthdayBox — included with this card
                </div>
              )}

              <div className="sc-card-actions">
                {canRecordWash && (
                  <button className="sc-btn-primary" onClick={recordWash} disabled={loading}>
                    {loading ? "Recording…" : "Record Wash"}
                  </button>
                )}
                {canUseFreeWash && (
                  <button className="sc-btn-success" onClick={useFreeWash} disabled={loading}>
                    {loading ? "Redeeming…" : "Redeem Free Wash"}
                  </button>
                )}
              </div>
            </div>
          ) : card === null && !showIssueForm ? (
            <div className="sc-no-card">No active stamp card found. Issue one above.</div>
          ) : null}
        </div>
      )}

      {/* All cards table */}
      <div className="sc-all-section">
        <h2>All Stamp Cards</h2>
        {allCards.length === 0 ? (
          <div className="sc-empty">No stamp cards issued yet.</div>
        ) : (
          <div className="sc-table-wrap">
            <table className="sc-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Expiry</th>
                  <th>Free Wash</th>
                  <th>BirthdayBox</th>
                </tr>
              </thead>
              <tbody>
                {allCards.map(c => (
                  <tr key={c.card_id} className="sc-table-row" onClick={() => selectCardFromTable(c)}>
                    <td>{c.customer_name || "—"}</td>
                    <td>{c.customer_phone || "—"}</td>
                    <td>
                      <div className="sc-mini-row">
                        <div className="sc-mini-dots">
                          {Array.from({ length: c.total_washes }, (_, i) => (
                            <div key={i} className={`sc-mini-dot${i < c.washes_used ? " sc-mini-dot--used" : ""}`} />
                          ))}
                        </div>
                        <span className="sc-mini-count">{c.washes_used}/{c.total_washes}</span>
                      </div>
                    </td>
                    <td><span className={`sc-status sc-status--${c.status}`}>{c.status.toUpperCase()}</span></td>
                    <td>{c.expiry_date}</td>
                    <td>
                      {c.free_wash_earned
                        ? c.free_wash_used ? <span className="sc-tick sc-tick--used">Used</span> : <span className="sc-tick sc-tick--earned">Earned</span>
                        : "—"}
                    </td>
                    <td>{c.birthday_box_discount ? <span className="sc-tick sc-tick--earned">50% off</span> : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
