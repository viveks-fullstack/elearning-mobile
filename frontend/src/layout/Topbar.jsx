import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../app/authContext";
import UserIcon from "../assets/svg/UserIcon";
import LogoutIcon from "../assets/svg/LogoutIcon";

export default function Topbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const userName = "Admin";

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div
      className="glass"
      style={{
        height: "80px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 40px",
        margin: "20px 20px 0 20px",
        borderRadius: "20px",
      }}
    >
      <h4
        style={{
          fontWeight: 600,
          color: "#1e293b",
          margin: 0,
          fontSize: "1.3rem",
        }}
      >
        Admin Dashboard
      </h4>

      <div style={{ position: "relative" }}>
        <div
          onClick={() => setOpen(!open)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            cursor: "pointer",
            padding: "8px 16px",
            borderRadius: "12px",
            background: "rgba(99, 102, 241, 0.08)",
            border: "1px solid rgba(99, 102, 241, 0.15)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(99, 102, 241, 0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(99, 102, 241, 0.08)";
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: "1rem",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
            }}
          >
            {initials}
          </div>
          <span style={{ fontWeight: 500, color: "#1e293b" }}>{userName}</span>
          <span style={{ color: "#64748b", fontSize: "0.8rem" }}>▼</span>
        </div>

        {open && (
          <div
            className="animate-fade-in"
            style={{
              position: "absolute",
              right: 0,
              top: "65px",
              width: "220px",
              padding: "12px",
              zIndex: 1000,
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              borderRadius: "16px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
            }}
          >
            <div
              onClick={() => {
                navigate("/profile");
                setOpen(false);
              }}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                borderRadius: "10px",
                transition: "all 0.3s ease",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(99, 102, 241, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <UserIcon size={18} color="#667eea" /> Profile
            </div>

            <div
              onClick={logout}
              style={{
                padding: "12px 16px",
                color: "#ef4444",
                cursor: "pointer",
                borderRadius: "10px",
                transition: "all 0.3s ease",
                fontWeight: 500,
                marginTop: "4px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <LogoutIcon size={18} color="#ef4444" /> Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
