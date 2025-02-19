import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register"; // Importa el componente Register
import RegisterProduct from "./pages/RegisterProduct";
import ModifyProduct from "./pages/ModifyProduct";
import Support from "./pages/Support";
import Reports from "./pages/Reports";
import ActivityHistory from "./pages/ActivityHistory";

import "@fontsource/merriweather";

function App() {
  return (
    <Router>
      <div
        style={{
          backgroundColor: "#fae1dd", // color pastel de fondo
          minHeight: "100vh", // alto de la pantalla
          width: "100vw", // ancho de la pantalla
        }}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} /> {/* Ruta Login */}
          <Route path="/register" element={<Register />} /> {/* Ruta Register */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register-product" element={<RegisterProduct />} />
          <Route path="/modify-product" element={<ModifyProduct />} />
          <Route path="/support" element={<Support />} />
          <Route path="/activity-history" element={<ActivityHistory />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
