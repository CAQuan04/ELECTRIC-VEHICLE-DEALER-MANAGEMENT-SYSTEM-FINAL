import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = login(email.trim(), password);
    if (!ok) {
      alert("Sai email hoặc mật khẩu!\nDùng: admin@ev.com / 123456");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="login-card shadow-lg" style={{ maxWidth: "420px", width: "100%" }}>
        <h2 className="text-center mb-4 fw-bold text-primary">
          🚗 EV Dealer Login
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="admin@ev.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="123456"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
