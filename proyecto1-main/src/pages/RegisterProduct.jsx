import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function RegisterProduct() {
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [costo, setCosto] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!nombre || !cantidad || !costo) {
      setError("Por favor, llena todos los campos.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Enviar los datos al backend
      const response = await axios.post("http://localhost:5000/registerproduct", {
        nombre,
        cantidad,
        costo,
      });

      alert("Producto registrado exitosamente");
      setNombre("");
      setCantidad("");
      setCosto("");
    } catch (err) {
      setError("Error al registrar el producto.");
      console.error("Error al registrar producto:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid d-flex" style={{ backgroundColor: "#fae1dd", minHeight: "100vh" }}>
      {/* Menú lateral */}
      <div
        className="d-flex flex-column align-items-start p-3"
        style={{
          backgroundColor: "#343a40",
          color: "white",
          width: "250px",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <h3 className="mb-4">Menú</h3>
        <Link to="/dashboard" className="btn btn-primary mb-3 w-100">Dashboard</Link>
        <Link to="/modify-product" className="btn btn-warning mb-3 w-100">Modificar Producto</Link>
        <Link to="/reports" className="btn btn-danger mb-3 w-100">Reportes</Link>
        <Link to="/activity-history" className="btn btn-info mb-3 w-100">Historial</Link>
        <Link to="/support" className="btn btn-secondary mb-3 w-100">Soporte</Link>
        <Link to="/" className="btn btn-danger w-100">Cerrar Sesión</Link>
      </div>

      {/* Barra superior con el texto "REGISTRAR PRODUCTO" */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          position: "fixed",
          top: 0,
          left: 250,
          right: 0,
          height: "80px",
          backgroundColor: "#343a40",
          color: "white",
          zIndex: 999,
        }}
      >
        <h2 className="text-center">REGISTRAR PRODUCTO</h2>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px", marginTop: "120px" }}>
        <h2 className="text-center text-primary">Registrar Producto</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleRegister} className="w-75 mx-auto p-4 shadow-lg rounded-lg bg-[#e2d4b7]">
          <div className="mb-4">
            <label className="form-label text-dark">Nombre del Producto</label>
            <input
              type="text"
              className="form-control rounded-lg p-3"
              placeholder="Ingrese el nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="form-label text-dark">Cantidad</label>
            <input
              type="number"
              className="form-control rounded-lg p-3"
              placeholder="Ingrese la cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="form-label text-dark">Costo</label>
            <input
              type="number"
              className="form-control rounded-lg p-3"
              placeholder="Ingrese el costo"
              value={costo}
              onChange={(e) => setCosto(e.target.value)}
            />
          </div>
          <button className="btn btn-warning w-100 py-3 rounded-lg shadow-md" disabled={loading}>
            {loading ? "Cargando..." : "Registrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterProduct;
