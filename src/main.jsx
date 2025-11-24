import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Cliente from "./pages/Cliente.jsx";

// ADMIN
import AdminLayout from "./admin/AdminLayout.jsx";
import Dashboard from "./admin/Dashboard.jsx";
import Veterinarios from "./admin/Veterinarios.jsx";
import Mascotas from "./admin/Mascotas.jsx";
import Citas from "./admin/Citas.jsx";

// ======================
// PROTECCIÓN DE RUTAS
// ======================
function RutaProtegida({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;
  return children;
}

function AdminProtegido({ children }) {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol"); // 🔥 usamos ROL, no proveedor

  if (!token) return <Navigate to="/login" />;

  if (rol !== "ADMIN") {
    return <Navigate to="/cliente" />;
  }

  return children;
}


// ======================
// RUTAS PRINCIPALES
// ======================
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        {/* Login y Registro */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Home general (solo muestra info del usuario) */}
        <Route
          path="/"
          element={
            <RutaProtegida>
              <Home />
            </RutaProtegida>
          }
        />

        {/* ===========================
                RUTA CLIENTE
           =========================== */}
        <Route
          path="/cliente"
          element={
            <RutaProtegida>
              <Cliente />
            </RutaProtegida>
          }
        />

        {/* ===========================
                RUTAS ADMIN
           =========================== */}
        <Route
          path="/admin"
          element={
            <AdminProtegido>
              <AdminLayout />
            </AdminProtegido>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="veterinarios" element={<Veterinarios />} />
          <Route path="mascotas" element={<Mascotas />} />
          <Route path="citas" element={<Citas />} />
        </Route>

      </Routes>
    </BrowserRouter>
  </StrictMode>
);
