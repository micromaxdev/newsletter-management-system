import React, { useState } from "react";
import { logout as logoutUser } from "../features/auth/authService";

export default function Logout() {
  const [dialogOpen, setDialogOpen] = useState(true);

  const handleConfirm = async () => {
    try {
      await logoutUser();
    } catch (err) {
      // Optionally handle error
    } finally {
      window.location.reload();
      setDialogOpen(false);
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  if (!dialogOpen) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "2rem",
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        Are you sure you want to logout?
      </div>
      <div>
        <button onClick={handleConfirm} style={{ marginRight: "1rem" }}>
          Yes
        </button>
        <button onClick={handleCancel}>No</button>
      </div>
    </div>
  );
}
