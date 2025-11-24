import { useEffect, useState } from "react";

console.log("TOKEN EN MASCOTAS:", localStorage.getItem("token"));

export default function Mascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    usuario_id: "",
    nombre: "",
    especie: "",
    raza: "",
    edad: "",
    peso: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    cargarMascotas();
    cargarUsuarios();
  }, []);

  async function cargarMascotas() {
    const res = await fetch("http://localhost:4000/api/mascotas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (data.ok) setMascotas(data.mascotas);
  }

  async function cargarUsuarios() {
    const res = await fetch("http://localhost:4000/api/usuarios", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (data.ok) setUsuarios(data.usuarios);
  }

  function manejarCambio(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function crearMascota(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:4000/api/mascotas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.ok) {
      alert("Mascota registrada");
      cargarMascotas();

      // Reset
      setForm({
        usuario_id: "",
        nombre: "",
        especie: "",
        raza: "",
        edad: "",
        peso: "",
      });
    }
  }

  return (
    <div>
      <h1 style={styles.titulo}>🐾 Gestión de Mascotas</h1>

      {/* FORMULARIO */}
      <form onSubmit={crearMascota} style={styles.form}>
        <select
          name="usuario_id"
          value={form.usuario_id}
          onChange={manejarCambio}
          style={styles.input}
          required
        >
          <option value="">Seleccione dueño...</option>
          {usuarios.map((u) => (
            <option value={u.id} key={u.id}>
              {u.nombre} ({u.email})
            </option>
          ))}
        </select>

        <input
          name="nombre"
          value={form.nombre}
          onChange={manejarCambio}
          placeholder="Nombre"
          style={styles.input}
          required
        />

        <input
          name="especie"
          value={form.especie}
          onChange={manejarCambio}
          placeholder="Especie"
          style={styles.input}
          required
        />

        <input
          name="raza"
          value={form.raza}
          onChange={manejarCambio}
          placeholder="Raza"
          style={styles.input}
        />

        <input
          name="edad"
          value={form.edad}
          onChange={manejarCambio}
          placeholder="Edad"
          type="number"
          style={styles.input}
        />

        <input
          name="peso"
          value={form.peso}
          onChange={manejarCambio}
          placeholder="Peso"
          type="number"
          style={styles.input}
        />

        <button style={styles.button}>Registrar Mascota</button>
      </form>

      {/* TABLA */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Especie</th>
            <th>Raza</th>
            <th>Edad</th>
            <th>Peso</th>
            <th>Dueño</th>
          </tr>
        </thead>

        <tbody>
          {mascotas.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.nombre}</td>
              <td>{m.especie}</td>
              <td>{m.raza}</td>
              <td>{m.edad}</td>
              <td>{m.peso}</td>
              <td>{m.dueño}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  titulo: {
    fontSize: "28px",
    marginBottom: "20px",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    gridColumn: "span 3",
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
  },
};
