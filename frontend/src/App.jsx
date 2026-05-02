import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import BookNow from "./pages/BookNow";
import Dashboard from "./pages/Dashboard";
import CustomerDetails from "./pages/Customer";
import TodaysBookings from "./pages/TodaysBookings";
import UpcomingBookings from "./pages/UpcomingBookings";
import OlderBookings from "./pages/OlderBookings";
import AddBooking from "./pages/AddBooking";
import Packages from "./pages/Packages";
import Holidays from "./pages/Holidays";
import StampCards from "./pages/StampCards";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/booknow" element={<BookNow />} />

      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="customers" element={<CustomerDetails />} />
        <Route path="packages" element={<Packages />} />
        <Route path="holidays" element={<Holidays />} />
        <Route path="stamp-cards" element={<StampCards />} />
        <Route path="addbooking" element={<AddBooking />} />
        <Route path="bookings/today" element={<TodaysBookings />} />
        <Route path="bookings/upcoming" element={<UpcomingBookings />} />
        <Route path="bookings/older" element={<OlderBookings />} />
      </Route>
    </Routes>
  );
}

export default App;
