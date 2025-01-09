import React from "react";

const AdminButton = () => {
  const role = localStorage.getItem("role");  // Pega o role do localStorage

  if (role !== "admin") {
    return null;  // Se não for admin, não mostra o botão
  }

  return (
    <button>Botão de Admin</button>
  );
};

export default AdminButton;