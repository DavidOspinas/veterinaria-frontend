import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import { db } from "./db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { verificarToken, verificarRol } from "./middlewareAuth.js";

dotenv.config();

// =====================================================
// 🔥 LOG DE VARIABLES IMPORTANTES
// =====================================================
console.log("========== VARIABLES DE ENTORNO LEÍDAS ==========");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("===================================================");

function generarToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

const app = express();

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.use(express.json());

// =====================================================
// 🔥 LOGIN ADMIN NORMAL
// =====================================================
app.post("/api/auth/login-admin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE email = ? AND proveedor = 'local'",
      [email]
    );

    if (rows.length === 0)
      return res.status(400).json({ ok: false, msg: "Usuario no encontrado" });

    const user = rows[0];

    const passwordValida = await bcrypt.compare(password, user.password);
    if (!passwordValida)
      return res.status(400).json({ ok: false, msg: "Contraseña incorrecta" });

    const [roles] = await db.query(
      "SELECT r.nombre FROM roles r JOIN usuarios_roles ur ON r.id = ur.rol_id WHERE ur.usuario_id = ?",
      [user.id]
    );

    const rol = roles[0]?.nombre || "CLIENTE";
    const token = generarToken(user);

    res.json({ ok: true, user, token, rol });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error interno" });
  }
});

// =====================================================
// 🔥 LOGIN GOOGLE (VERSIÓN DEBUG ULTRA DETALLADA)
// =====================================================
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post("/api/auth/google", async (req, res) => {
  try {
    console.log("\n========== LOGIN GOOGLE ==========");

    const tokenGoogle = req.body.credential || req.body.id_token;

    console.log("Token recibido:", tokenGoogle ? "OK" : "NO LLEGÓ");
    console.log("CLIENT_ID esperado:", process.env.GOOGLE_CLIENT_ID);

    if (!tokenGoogle) {
      console.log("ERROR: El frontend NO envió token.");
      return res.status(400).json({ ok: false, msg: "Falta token de Google" });
    }

    console.log("Verificando con Google...");

    const ticket = await client.verifyIdToken({
      idToken: tokenGoogle,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    console.log("TOKEN VERIFICADO ✔");

    const payload = ticket.getPayload();
    console.log("PAYLOAD GOOGLE:");
    console.log(payload);

    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;

    // Buscar usuario
    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    let user = rows.length ? rows[0] : null;

    if (!user) {
      console.log("Usuario nuevo, creando...");

      const [result] = await db.query(
        "INSERT INTO usuarios (nombre, email, foto_perfil, proveedor) VALUES (?, ?, ?, 'google')",
        [name, email, picture]
      );

      user = {
        id: result.insertId,
        nombre: name,
        email,
        foto_perfil: picture,
      };

      const [rolCliente] = await db.query(
        "SELECT id FROM roles WHERE nombre = 'CLIENTE'"
      );

      await db.query(
        "INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (?, ?)",
        [user.id, rolCliente[0].id]
      );

      console.log("Usuario creado con ID:", user.id);
    } else {
      console.log("Usuario existente encontrado:", user.id);
    }

    const token = generarToken(user);

    res.json({ ok: true, user, token, rol: "CLIENTE" });

    console.log("LOGIN GOOGLE OK ✔");

  } catch (err) {
    console.error("\n❌ ERROR GOOGLE LOGIN:");
    console.error("Mensaje:", err.message);
    console.error("Stack:", err.stack);

    res.status(401).json({ ok: false, msg: "Token inválido o expirado" });
  }
});

// =====================================================
// 🔥 INICIO DEL SERVIDOR
// =====================================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Servidor backend corriendo en el puerto ${PORT}`);
});
