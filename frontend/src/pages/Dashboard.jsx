import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <a className="navbar-brand fw-bold" href="#">
          🚙 EV Dealer
        </a>
        <div className="ms-auto d-flex align-items-center">
          <span className="text-white me-3">Hi, {user?.email}</span>
          <button className="btn btn-outline-light btn-sm" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="container py-5">
        <h2 className="mb-4 fw-bold">Dashboard Overview</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card card-stat shadow-sm p-3 text-center">
              <h5 className="fw-bold">Vehicles</h5>
              <p className="display-6 text-primary">120</p>
              <small className="text-muted">Total cars in stock</small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card card-stat shadow-sm p-3 text-center">
              <h5 className="fw-bold">Customers</h5>
              <p className="display-6 text-success">85</p>
              <small className="text-muted">Active buyers</small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card card-stat shadow-sm p-3 text-center">
              <h5 className="fw-bold">Sales</h5>
              <p className="display-6 text-danger">$250K</p>
              <small className="text-muted">Revenue this month</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
