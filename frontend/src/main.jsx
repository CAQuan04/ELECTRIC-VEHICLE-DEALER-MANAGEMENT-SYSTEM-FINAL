import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { AuthProvider } from "./context/AuthContext.jsx";

// BrowserRouter phải ở ngoài AuthProvider nếu AuthProvider KHÔNG dùng useNavigate.
// Ở đây AuthProvider dùng useNavigate nên phải đặt *bên trong* BrowserRouter.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

