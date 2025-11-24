export default function Dashboard() {
  return (
    <div>
      <h1>📊 Dashboard Administrador</h1>

      <div style={styles.cards}>
        <div style={styles.card}>
          <h2>Veterinarios</h2>
          <p>Administrar veterinarios del sistema</p>
        </div>

        <div style={styles.card}>
          <h2>Clientes</h2>
          <p>Gestión de usuarios registrados</p>
        </div>

        <div style={styles.card}>
          <h2>Citas</h2>
          <p>Control de citas veterinarias</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  cards: {
    display: "flex",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    flex: 1,
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
};
