import { useState } from "react";

// 🔥 URL del backend desde .env o .env.production
const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");

  async function registrar(e) {
    e.preventDefault();

    if (!nombre || !email || !password || !confirmar) {
      return alert("Todos los campos son obligatorios");
    }

    if (password !== confirmar) {
      return alert("Las contraseñas no coinciden");
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await res.json();

      if (!data.ok) {
        return alert(data.msg);
      }

      alert("Cuenta creada con éxito");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert("Error en el servidor");
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Crear Cuenta</h2>

        <form onSubmit={registrar} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <input
            type="email"
            style={styles.input}
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            style={styles.input}
            placeholder="Confirmar contraseña"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
          />

          <button style={styles.button}>Registrarme</button>
        </form>

        <p style={styles.link}>
          ¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f2f2f2",
  },
  card: {
    background: "white",
    padding: "35px",
    width: "360px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  button: {
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },
  link: {
    marginTop: "15px",
    fontSize: "14px",
  },
};
