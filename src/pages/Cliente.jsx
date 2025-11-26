import { useEffect, useState } from "react";
import { getUser, isLoggedIn } from "../auth";

// 🔥 URL del backend desde .env o .env.production
const API_URL = import.meta.env.VITE_API_URL;

export default function Cliente() {
  if (!isLoggedIn()) {
    window.location.href = "/login";
    return null;
  }

  const user = getUser();

  const [mascotas, setMascotas] = useState([]);
  const [citas, setCitas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);

  const [nombreMascota, setNombreMascota] = useState("");
  const [especie, setEspecie] = useState("");
  const [raza, setRaza] = useState("");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");

  const [veterinarioId, setVeterinarioId] = useState("");
  const [fechaCita, setFechaCita] = useState("");
  const [motivo, setMotivo] = useState("");

  const token = localStorage.getItem("token");

  // ======================================================
  // CARGAR MASCOTAS, CITAS Y VETERINARIOS
  // ======================================================
  useEffect(() => {
    cargarMascotas();
    cargarCitas();
    cargarVeterinarios();
  }, []);

  async function cargarMascotas() {
    const res = await fetch(`${API_URL}/api/cliente/mascotas/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setMascotas(data.mascotas || []);
  }

  async function cargarCitas() {
    const res = await fetch(`${API_URL}/api/cliente/citas/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setCitas(data.citas || []);
  }

  async function cargarVeterinarios() {
    const res = await fetch(`${API_URL}/api/public/veterinarios`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setVeterinarios(data.veterinarios || []);
  }

  // ======================================================
  // AGREGAR MASCOTA
  // ======================================================
  async function crearMascota() {
    if (!nombreMascota || !especie) return alert("Faltan campos");

    const res = await fetch(`${API_URL}/api/cliente/mascotas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        usuario_id: user.id,
        nombre: nombreMascota,
        especie,
        raza,
        edad,
        peso,
      }),
    });

    const data = await res.json();
    if (data.ok) {
      alert("Mascota registrada");
      cargarMascotas();
    }
  }

  // ======================================================
  // AGENDAR CITA
  // ======================================================
  async function crearCita() {
    if (!veterinarioId || !fechaCita || !motivo)
      return alert("Complete todos los campos");

    const res = await fetch(`${API_URL}/api/cliente/citas`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mascota_id: mascotas[0]?.id,
        veterinario_id: veterinarioId,
        fecha: fechaCita,
        motivo,
      }),
    });

    const data = await res.json();

    if (data.ok) {
      alert("Cita creada exitosamente");
      cargarCitas();
    } else {
      alert("Error: " + data.msg);
    }
  }

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2>Cliente</h2>
        <p>{user.nombre}</p>
        <p>{user.email}</p>

        {user.foto_perfil && (
          <img src={user.foto_perfil} style={styles.avatar} />
        )}

        <button
          style={styles.logout}
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Cerrar sesión
        </button>
      </aside>

      <main style={styles.main}>
        <h1>Panel del Cliente</h1>

        {/* ===================== MASCOTAS ===================== */}
        <section style={styles.section}>
          <h2>🐾 Mis Mascotas</h2>

          <div style={styles.card}>
            <h3>Agregar Mascota</h3>

            <input
              placeholder="Nombre"
              value={nombreMascota}
              onChange={(e) => setNombreMascota(e.target.value)}
            />

            <input
              placeholder="Especie"
              value={especie}
              onChange={(e) => setEspecie(e.target.value)}
            />

            <input
              placeholder="Raza"
              value={raza}
              onChange={(e) => setRaza(e.target.value)}
            />

            <input
              placeholder="Edad en años"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
            />

            <input
              placeholder="Peso (kg)"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
            />

            <button style={styles.btn} onClick={crearMascota}>
              Registrar Mascota
            </button>
          </div>

          <div>
            {mascotas.map((m) => (
              <div key={m.id} style={styles.item}>
                <strong>{m.nombre}</strong> – {m.especie} ({m.raza})
              </div>
            ))}
          </div>
        </section>

        {/* ===================== CITAS ===================== */}
        <section style={styles.section}>
          <h2>📅 Mis Citas</h2>

          <div style={styles.card}>
            <h3>Agendar Cita</h3>

            <select
              value={veterinarioId}
              onChange={(e) => setVeterinarioId(e.target.value)}
            >
              <option value="">Seleccione veterinario</option>
              {veterinarios.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nombre}
                </option>
              ))}
            </select>

            <input
              type="datetime-local"
              value={fechaCita}
              onChange={(e) => setFechaCita(e.target.value)}
            />

            <input
              placeholder="Motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />

            <button style={styles.btn} onClick={crearCita}>
              Crear Cita
            </button>
          </div>

          <div>
            {citas.map((c) => (
              <div key={c.id} style={styles.item}>
                <strong>{c.motivo}</strong> –{" "}
                {new Date(c.fecha).toLocaleString()}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "#f6f7fb",
  },
  sidebar: {
    width: "260px",
    background: "#111827",
    color: "white",
    padding: "20px",
  },
  avatar: {
    width: "90px",
    borderRadius: "50%",
    marginTop: "10px",
  },
  logout: {
    marginTop: "20px",
    padding: "10px",
    background: "red",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
  main: {
    flex: 1,
    padding: "30px",
    overflowY: "scroll",
  },
  section: {
    marginBottom: "40px",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "400px",
  },
  btn: {
    background: "#2563eb",
    color: "white",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
  item: {
    background: "white",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "10px",
    boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
  },
};

