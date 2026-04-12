import React, { useEffect, useState } from "react";
import { Mic, ScanLine, LoaderCircle } from "lucide-react";
import "../css/Dashboard.css";
import { apiRequest } from "../utils/APIrequest";
import { BASE_URL } from "../services/utils";
import { readVehicleNumberFromImage, startSpeechInput } from "../utils/inputAssist";

const emptyForm = {
  customer_phone: "",
  customer_id: null,
  package_id: "",
  vehicle_type_id: "",
  vehicle_number: "",
  appointment_date: "",
  appointment_time: "",
  staff_id: "",
  status: "pending",
  payment_mode: "",
  payment_total: "",
  payment_paid: "",
  notes: "",
};

export default function AddBooking() {
  const [form, setForm] = useState(emptyForm);
  const [packages, setPackages] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [availableStaff, setAvailableStaff] = useState([]);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [activeVoiceField, setActiveVoiceField] = useState("");
  const [isScanningPlate, setIsScanningPlate] = useState(false);

  useEffect(() => {
    apiRequest({ url: `${BASE_URL}/bookings/packages` }).then(setPackages).catch(() => {});
    apiRequest({ url: `${BASE_URL}/bookings/vehicle-types` }).then(setVehicleTypes).catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.appointment_date) {
      setAvailableStaff([]);
      return;
    }
    apiRequest({ url: `${BASE_URL}/bookings/available-staff?date=${form.appointment_date}` })
      .then(setAvailableStaff)
      .catch(() => setAvailableStaff([]));
  }, [form.appointment_date]);

  const lookupCustomer = async () => {
    if (!form.customer_phone || form.customer_phone.length < 10) return;
    try {
      const customer = await apiRequest({ url: `${BASE_URL}/customers/details/${form.customer_phone}` });
      setForm((prev) => ({ ...prev, customer_id: customer.customer_id }));
      setCustomerName(customer.name);
    } catch {
      setCustomerName("");
      setForm((prev) => ({ ...prev, customer_id: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    let customerId = form.customer_id;
    if (!customerId) {
      try {
        const response = await apiRequest({
          url: `${BASE_URL}/customers/submit`,
          method: "POST",
          data: { name: customerName || "Walk-in", phone_number: form.customer_phone },
        });
        customerId = response.customer_id;
      } catch (error) {
        setErr(`Could not create customer: ${error.message}`);
        return;
      }
    }

    try {
      await apiRequest({
        url: `${BASE_URL}/bookings/submit`,
        method: "POST",
        data: {
          customer_id: customerId,
          package_id: parseInt(form.package_id, 10),
          vehicle_type_id: parseInt(form.vehicle_type_id, 10),
          vehicle_number: form.vehicle_number || null,
          appointment_date: form.appointment_date,
          appointment_time: form.appointment_time,
          staff_id: form.staff_id ? parseInt(form.staff_id, 10) : null,
          status: form.status,
          payment_mode: form.payment_mode || null,
          payment_total: form.payment_total ? parseFloat(form.payment_total) : null,
          payment_paid: form.payment_paid ? parseFloat(form.payment_paid) : null,
          notes: form.notes || null,
        },
      });
      setMsg("Appointment booked successfully.");
      setForm(emptyForm);
      setCustomerName("");
      setAvailableStaff([]);
    } catch (error) {
      setErr(error.message);
    }
  };

  const startVoiceFill = (field) => {
    setErr(null);
    startSpeechInput({
      mode: field,
      onStart: () => setActiveVoiceField(field),
      onEnd: () => setActiveVoiceField(""),
      onError: (message) => setErr(message),
      onResult: (value) => {
        if (field === "phone") {
          setForm((prev) => ({ ...prev, customer_phone: value }));
          return;
        }

        setCustomerName(value);
      },
    });
  };

  const handlePlateScan = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    setErr(null);
    setIsScanningPlate(true);
    try {
      const plate = await readVehicleNumberFromImage(file);
      setForm((prev) => ({ ...prev, vehicle_number: plate }));
    } catch (error) {
      setErr(error.message);
    } finally {
      setIsScanningPlate(false);
    }
  };

  return (
    <div className="page-shell">
      <section className="page-header">
        <div className="page-header-copy">
          <span className="page-eyebrow">Front desk</span>
          <h1 className="page-title">Add appointment</h1>
          <p className="page-sub">
            Create a wash booking manually for walk-ins, phone reservations, or customers who need a
            staff-assisted slot.
          </p>
        </div>
      </section>

      {msg && <div className="cc-alert-success">{msg}</div>}
      {err && <div className="cc-alert-error">{err}</div>}

      <div className="cc-form-card">
        <div className="cc-form-card-head">
          <h3>Booking details</h3>
          <p>Assign the package, vehicle, time, and payment details in one place.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="cc-form-row">
            <div className="cc-form-group">
              <label>Customer Phone</label>
              <div className="cc-field-control">
                <input
                  required
                  value={form.customer_phone}
                  onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                  onBlur={lookupCustomer}
                  placeholder="Phone number"
                />
                <button
                  type="button"
                  className="cc-icon-btn"
                  onClick={() => startVoiceFill("phone")}
                  aria-label="Fill phone number using microphone"
                >
                  {activeVoiceField === "phone" ? <LoaderCircle size={16} className="spin" /> : <Mic size={16} />}
                </button>
              </div>
            </div>
            <div className="cc-form-group">
              <label>Customer Name</label>
              <div className="cc-field-control">
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Auto-filled or enter manually"
                />
                <button
                  type="button"
                  className="cc-icon-btn"
                  onClick={() => startVoiceFill("name")}
                  aria-label="Fill name using microphone"
                >
                  {activeVoiceField === "name" ? <LoaderCircle size={16} className="spin" /> : <Mic size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="cc-form-row">
            <div className="cc-form-group">
              <label>Wash Package</label>
              <select
                required
                value={form.package_id}
                onChange={(e) => setForm({ ...form, package_id: e.target.value })}
              >
                <option value="">Select package</option>
                {packages.map((pkg) => (
                  <option key={pkg.package_id} value={pkg.package_id}>
                    {pkg.package_name} - Rs {pkg.price}
                  </option>
                ))}
              </select>
            </div>
            <div className="cc-form-group">
              <label>Vehicle Type</label>
              <select
                required
                value={form.vehicle_type_id}
                onChange={(e) => setForm({ ...form, vehicle_type_id: e.target.value })}
              >
                <option value="">Select vehicle type</option>
                {vehicleTypes.map((vehicle) => (
                  <option key={vehicle.vehicle_type_id} value={vehicle.vehicle_type_id}>
                    {vehicle.vehicle_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="cc-form-row">
            <div className="cc-form-group">
              <label>Vehicle Number Plate</label>
              <div className="cc-field-control">
                <input
                  value={form.vehicle_number}
                  onChange={(e) => setForm({ ...form, vehicle_number: e.target.value.toUpperCase() })}
                  placeholder="e.g. KA 09 AB 1234"
                />
                <label className="cc-icon-btn cc-upload-btn" aria-label="Scan vehicle number from camera or image">
                  {isScanningPlate ? <LoaderCircle size={16} className="spin" /> : <ScanLine size={16} />}
                  <input type="file" accept="image/*" capture="environment" onChange={handlePlateScan} hidden />
                </label>
              </div>
            </div>
            <div className="cc-form-group">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="cc-form-row">
            <div className="cc-form-group">
              <label>Appointment Date</label>
              <input
                required
                type="date"
                value={form.appointment_date}
                onChange={(e) => setForm({ ...form, appointment_date: e.target.value, staff_id: "" })}
              />
            </div>
            <div className="cc-form-group">
              <label>Appointment Time</label>
              <input
                required
                type="time"
                value={form.appointment_time}
                onChange={(e) => setForm({ ...form, appointment_time: e.target.value })}
              />
            </div>
          </div>

          <div className="cc-form-row">
            <div className="cc-form-group">
              <label>Assign Staff</label>
              <select
                value={form.staff_id}
                onChange={(e) => setForm({ ...form, staff_id: e.target.value })}
                disabled={!form.appointment_date}
              >
                <option value="">{form.appointment_date ? "Unassigned" : "Select a date first"}</option>
                {availableStaff.map((staff) => (
                  <option key={staff.staff_id} value={staff.staff_id}>
                    {staff.name}
                    {staff.role ? ` - ${staff.role}` : ""}
                  </option>
                ))}
              </select>
              {form.appointment_date && availableStaff.length === 0 && (
                <small className="cc-form-note">No staff available on this date.</small>
              )}
            </div>
            <div className="cc-form-group">
              <label>Payment Mode</label>
              <select
                value={form.payment_mode}
                onChange={(e) => setForm({ ...form, payment_mode: e.target.value })}
              >
                <option value="">Select payment mode</option>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>
            </div>
          </div>

          <div className="cc-form-row">
            <div className="cc-form-group">
              <label>Total Amount</label>
              <input
                type="number"
                value={form.payment_total}
                onChange={(e) => setForm({ ...form, payment_total: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="cc-form-group">
              <label>Amount Paid</label>
              <input
                type="number"
                value={form.payment_paid}
                onChange={(e) => setForm({ ...form, payment_paid: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="cc-form-group">
            <label>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Optional booking notes"
            />
          </div>

          <button type="submit" className="cc-btn-submit">
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
}
