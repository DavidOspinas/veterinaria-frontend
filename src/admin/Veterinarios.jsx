import { useEffect, useState } from "react";
console.log("TOKEN EN VETERINARIOS:", localStorage.getItem("token"));

export default function Veterinarios() {
  const [veterinarios, setVeterinarios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    usuario_id: "",
    especialidad: "",
    telefono: "",
  });

  const token = localStorage.getItem("token");

  // ===============================
  // Cargar veterinarios
  // ===============================
  async function cargarVeterinarios() {
    try {
      const res = await fetch("http://localhost:4000/api/veterinarios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.ok) setVeterinarios(data.veterinarios);
      else console.error("Backend:", data);
    } catch (err) {
      console.error("Error cargando veterinarios:", err);
    }
  }

  // ===============================
  // Cargar usuarios
  // ===============================
  async function cargarUsuarios() {
    try {
      const res = await fetch("http://localhost:4000/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.ok) setUsuarios(data.usuarios);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    }
  }

  useEffect(() => {
    cargarVeterinarios();
    cargarUsuarios();
  }, []);

  function manejarCambio(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // ===============================
  // Crear veterinario
  // ===============================
  async function crearVeterinario(e) {
    e.preventDefault();

    if (!form.usuario_id) return alert("Seleccione un usuario");

    const body = {
      usuario_id: form.usuario_id,
      especialidad: form.especialidad,
      telefono: form.telefono,
    };

    try {
      const res = await fetch("http://localhost:4000/api/veterinarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.ok) {
        alert("Veterinario registrado");
        cargarVeterinarios();
        setForm({ usuario_id: "", especialidad: "", telefono: "" });
      } else {
        alert(data.msg);
      }
    } catch (err) {
      console.error("Error creando veterinario:", err);
    }
  }

  // ===============================
  // Eliminar veterinario
  // ===============================
  async function eliminarVeterinario(id) {
  // 1️⃣ Consultar cuántas citas tiene
  const resCount = await fetch(`http://localhost:4000/api/veterinarios/${id}/citas-count`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  const dataCount = await resCount.json();

  if (!dataCount.ok) {
    return alert("Error obteniendo citas del veterinario.");
  }

  const total = dataCount.total;

  // 2️⃣ Si tiene citas → NO permitir eliminar
  if (total > 0) {
    return alert(
      `No se puede eliminar este veterinario.\nTiene ${total} cita(s) registradas.`
    );
  }

  // 3️⃣ Si NO tiene citas → Preguntar confirmación
  if (!confirm("¿Seguro que deseas eliminar este veterinario?")) return;

  // 4️⃣ Eliminar veterinario
  const res = await fetch(`http://localhost:4000/api/veterinarios/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const data = await res.json();

  if (!data.ok) {
    alert(data.msg);
    return;
  }

  alert("Veterinario eliminado correctamente");
  cargarVeterinarios();
}

  return (
    <div>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>🩺 Gestión de Veterinarios</h1>

      {/* FORMULARIO */}
      <form
        onSubmit={crearVeterinario}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <select
          name="usuario_id"
          value={form.usuario_id}
          onChange={manejarCambio}
          style={inputStyle}
          required
        >
          <option value="">Seleccione usuario…</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nombre} ({u.email})
            </option>
          ))}
        </select>

        <input
          name="especialidad"
          placeholder="Especialidad"
          value={form.especialidad}
          onChange={manejarCambio}
          style={inputStyle}
          required
        />

        <input
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={manejarCambio}
          style={inputStyle}
        />

        <button
          style={{
            gridColumn: "span 3",
            padding: "12px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Registrar Veterinario
        </button>
      </form>

      {/* TABLA */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre/Email</th>
            <th>Especialidad</th>
            <th>Teléfono</th>
            <th>Eliminar</th>
          </tr>
        </thead>

        <tbody>
          {veterinarios.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>
                <strong>{v.nombre}</strong>
                <br />
                <small>{v.email}</small>
              </td>
              <td>{v.especialidad}</td>
              <td>{v.telefono}</td>
              <td>
                <button
                  onClick={() => eliminarVeterinario(v.id)}
                  style={{
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "5px",
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

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};
