import { useEffect, useState } from "react";

// 🔥 URL del backend desde .env o .env.production
const API_URL = import.meta.env.VITE_API_URL;

export default function Citas() {
  const [mascotas, setMascotas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [citas, setCitas] = useState([]);

  const [mascotaId, setMascotaId] = useState("");
  const [veterinarioId, setVeterinarioId] = useState("");
  const [fecha, setFecha] = useState("");
  const [motivo, setMotivo] = useState("");

  const token = localStorage.getItem("token");

  // =============================
  // Cargar datos iniciales
  // =============================
  useEffect(() => {
    cargarDatosIniciales();
    cargarMascotas();
    cargarVeterinarios();
  }, []);

  async function cargarDatosIniciales() {
    try {
      const res = await fetch(`${API_URL}/api/citas`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.ok) {
        setCitas(data.citas);
      }
    } catch (err) {
      console.error("Error al cargar datos:", err);
    }
  }

  async function cargarMascotas() {
    try {
      const res = await fetch(`${API_URL}/api/mascotas`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) setMascotas(data.mascotas);
    } catch (err) {
      console.error("Error cargando mascotas:", err);
    }
  }

  async function cargarVeterinarios() {
    try {
      const res = await fetch(`${API_URL}/api/veterinarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) setVeterinarios(data.veterinarios);
    } catch (err) {
      console.error("Error cargando veterinarios:", err);
    }
  }

  // =============================
  // Crear cita
  // =============================
  async function crearCita() {
    if (!mascotaId || !veterinarioId || !fecha || !motivo) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/citas`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mascota_id: mascotaId,
          veterinario_id: veterinarioId,
          fecha,
          motivo,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        alert("Cita creada correctamente");

        cargarDatosIniciales();

        setMascotaId("");
        setVeterinarioId("");
        setFecha("");
        setMotivo("");
      }
    } catch (error) {
      console.error("Error creando cita:", error);
    }
  }

  // =============================
  // Eliminar cita
  // =============================
  async function eliminarCita(id) {
    if (!confirm("¿Eliminar esta cita?")) return;

    try {
      const res = await fetch(`${API_URL}/api/citas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.ok) {
        alert("Cita eliminada");
        cargarDatosIniciales();
      }
    } catch (error) {
      console.error("Error eliminando cita:", error);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        📅 Gestión de Citas Veterinarias
      </h1>

      <div style={styles.card}>
        {/* Mascota */}
        <select
          style={styles.input}
          value={mascotaId}
          onChange={(e) => setMascotaId(e.target.value)}
        >
          <option value="">Seleccione mascota...</option>
          {mascotas.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>

        {/* Veterinario */}
        <select
          style={styles.input}
          value={veterinarioId}
          onChange={(e) => setVeterinarioId(e.target.value)}
        >
          <option value="">Seleccione veterinario...</option>
          {veterinarios.map((v) => (
            <option key={v.id} value={v.id}>
              {v.nombre}
            </option>
          ))}
        </select>

        {/* Fecha */}
        <input
          type="datetime-local"
          style={styles.input}
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        {/* Motivo */}
        <input
          type="text"
          placeholder="Motivo"
          style={{ ...styles.input, width: "100%" }}
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />

        <button style={styles.button} onClick={crearCita}>
          Crear Cita
        </button>
      </div>

      {/* TABLA DE CITAS */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Mascota</th>
            <th>Veterinario</th>
            <th>Fecha</th>
            <th>Motivo</th>
            <th>Eliminar</th>
          </tr>
        </thead>

        <tbody>
          {citas.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.mascota ?? "No aplica"}</td>
              <td>{c.veterinario ?? "No aplica"}</td>
              <td>{c.fecha ? new Date(c.fecha).toLocaleString() : ""}</td>
              <td>{c.motivo}</td>
              <td>
                <button
                  onClick={() => eliminarCita(c.id)}
                  style={{
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    minWidth: "200px",
  },
  button: {
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    width: "100%",
    fontSize: "16px",
    marginTop: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
  },
};

