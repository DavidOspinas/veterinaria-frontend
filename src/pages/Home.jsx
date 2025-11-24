import { isLoggedIn, getUser } from "../auth";

export default function Home() {
  if (!isLoggedIn()) {
    window.location.href = "/login";
    return null;
  }

  const usuario = getUser();
  const rol = localStorage.getItem("rol");

  // 🔥 Si es admin → panel admin
  if (rol === "ADMIN") {
    window.location.href = "/admin";
    return null;
  }

  // 🔥 Si es cliente → panel cliente
  window.location.href = "/cliente";
  return null;
}
