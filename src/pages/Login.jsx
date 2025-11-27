import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [emailAdmin, setEmailAdmin] = useState("");
  const [passAdmin, setPassAdmin] = useState("");

  useEffect(() => {
    console.log("Inicializando Google One Tap...");

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleLoginDiv"),
      {
        theme: "outline",
        size: "large",
        width: "280",
      }
    );
  }, []);

  async function handleCredentialResponse(response) {
    try {
      const tokenGoogle = response.credential;

      const backendResponse = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential: tokenGoogle,
          id_token: tokenGoogle,
        }),
      });

      const data = await backendResponse.json();

      if (!data.ok) {
        alert("Fallo el inicio de sesión con Google");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.user));
      localStorage.setItem("rol", data.rol);

      if (data.rol === "ADMIN") window.location.href = "/admin";
      else window.location.href = "/cliente";
    } catch (error) {
      console.error("Error enviando token al backend:", error);
    }
  }

  async function loginAdmin(e) {
    e.preventDefault();

    const res = await fetch(`${API_URL}/api/auth/login-admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailAdmin,
        password: passAdmin,
      }),
    });

    const data = await res.json();

    if (!data.ok) {
      alert(data.msg);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.user));
    localStorage.setItem("rol", data.rol);

    if (data.rol === "ADMIN") window.location.href = "/admin";
    else window.location.href = "/cliente";
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Iniciar Sesión</h2>

        <form onSubmit={loginAdmin} style={styles.form}>
          <input
            type="email"
            placeholder="Correo administrador"
            value={emailAdmin}
            onChange={(e) => setEmailAdmin(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={passAdmin}
            onChange={(e) => setPassAdmin(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Entrar como Admin
          </button>
        </form>

        <div style={{ marginTop: 20 }}>
          <strong>O entrar con Google</strong>
        </div>

        <div id="googleLoginDiv" style={{ marginTop: 10 }}></div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f2f2f2",
  },
  card: {
    width: "360px",
    padding: "30px",
    borderRadius: "12px",
    background: "white",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    marginTop: "10px",
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

