import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ActivityHistory() {
  const [activityHistory, setActivityHistory] = useState([]);

  // Función para obtener el historial de actividades
  const fetchActivityHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/get-activity-history');
      const data = await response.json(); // Convertimos la respuesta a JSON
      setActivityHistory(data); // Establecemos los datos en el estado
    } catch (error) {
      console.error("Error al obtener el historial de actividades:", error);
    }
  };

  // Llamar a la función cuando el componente se monta
  useEffect(() => {
    fetchActivityHistory();
  }, []);

  return (
    <div className="container-fluid d-flex" style={{ backgroundColor: "#fae1dd", minHeight: "100vh" }}>
     
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
        <Link to="/register-product" className="btn btn-success mb-3 w-100">Registrar Producto</Link>
        <Link to="/modify-product" className="btn btn-warning mb-3 w-100">Modificar Producto</Link>
        <Link to="/reports" className="btn btn-info mb-3 w-100">Reportes</Link>
        <Link to="/support" className="btn btn-secondary mb-3 w-100">Soporte</Link>
        <Link to="/" className="btn btn-danger w-100">Cerrar Sesión</Link>
      </div>

      {/* Barra superior con el texto "HISTORIAL DE ACTIVIDAD" */}
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
        <h2 className="text-center">HISTORIAL DE ACTIVIDAD</h2>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px", marginTop: "120px" }}> 
        <p className="text-center">Consulta las acciones recientes dentro del sistema.</p>

        {/* Tabla de Historial */}
        <table className="table table-striped mt-4">
          <thead className="table-dark">
            <tr>
              <th>Fecha</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {activityHistory.length > 0 ? (
              activityHistory.map((activity, index) => (
                <tr key={index}>
                  <td>{new Date(activity.fecha).toLocaleDateString()}</td>
                  <td>{activity.usuario}</td>
                  <td>{activity.accion}</td>
                  <td>{activity.detalles}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No hay actividades recientes</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ActivityHistory;
