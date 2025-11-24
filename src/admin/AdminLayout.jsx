import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();

  // ================================
  // 🔒 Protección de ruta admin
  // ================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("usuario");

    // Token inválido, vacío o manipulado
    if (!token || !user || token === "null" || token === "undefined") {
      localStorage.clear();
      navigate("/login");
      return;
    }
  }, [navigate]);

  // ================================
  // 🔓 Logout
  // ================================
  function logout() {
    localStorage.clear();
    window.location.href = "/login";
  }

  return (
    <div style={styles.layout}>
      
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>ADMIN ICA</h2>

        <nav style={styles.menu}>
          
          <Link style={styles.link} to="/admin">
            🏠 Dashboard
          </Link>

          <Link style={styles.link} to="/admin/veterinarios">
            🩺 Veterinarios
          </Link>

          <Link style={styles.link} to="/admin/mascotas">
            🐾 Mascotas
          </Link>

          <Link style={styles.link} to="/admin/citas">
            📅 Citas
          </Link>

          <button style={styles.logoutBtn} onClick={logout}>
            🚪 Salir
          </button>
        </nav>
      </aside>

      {/* CONTENIDO */}
      <main style={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
    height: "100vh",
    background: "#f7f7f7",
  },
  sidebar: {
    width: "240px",
    background: "#111827",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "30px",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    padding: "10px",
    borderRadius: "6px",
    background: "#1f2937",
  },
  logoutBtn: {
    marginTop: "auto",
    padding: "10px",
    background: "#b91c1c",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  content: {
    flex: 1,
    padding: "30px",
  },
};
