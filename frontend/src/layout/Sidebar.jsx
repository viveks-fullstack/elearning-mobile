import { NavLink } from "react-router-dom";
import { useAuth } from "../app/authContext";
import HomeIcon from "../assets/svg/HomeIcon";
import StudentIcon from "../assets/svg/StudentIcon";
import TeacherIcon from "../assets/svg/TeacherIcon";
import ClassIcon from "../assets/svg/ClassIcon";
import CourseIcon from "../assets/svg/CourseIcon";
import LogoutIcon from "../assets/svg/LogoutIcon";
import GraduationCapIcon from "../assets/svg/GraduationCapIcon";

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <div
      className="glass-dark"
      style={{
        width: "260px",
        padding: "20px 15px",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "4px 0 24px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          color: "white",
          fontSize: "1.5rem",
          fontWeight: 700,
          marginBottom: "40px",
          padding: "20px 10px",
          textAlign: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(102, 126, 234, 0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <GraduationCapIcon size={28} color="white" /> Coaching ERP
      </div>

      {/* Menu */}
      <div style={{ flex: 1 }}>
        <SidebarItem
          to="/dashboard"
          icon={<HomeIcon size={20} />}
          label="Dashboard"
        />
        <SidebarItem
          to="/students"
          icon={<StudentIcon size={20} />}
          label="Students"
        />
        <SidebarItem
          to="/teachers"
          icon={<TeacherIcon size={20} />}
          label="Teachers"
        />
        <SidebarItem
          to="/classes"
          icon={<ClassIcon size={20} />}
          label="Classes"
        />
        <SidebarItem
          to="/courses"
          icon={<CourseIcon size={20} />}
          label="Courses"
        />
        {/* Logout */}
        <button
          onClick={logout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            marginTop: "20px",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: 500,
            transition: "all 0.3s ease",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#fca5a5",
            cursor: "pointer",
            width: "100%",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
          }}
        >
          <LogoutIcon size={20} color="#fca5a5" /> Logout
        </button>
      </div>
    </div>
  );
}

function SidebarItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 16px",
        marginBottom: "8px",
        borderRadius: "12px",
        textDecoration: "none",
        fontWeight: 500,
        fontSize: "0.95rem",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        background: isActive ? "rgba(255, 255, 255, 0.15)" : "transparent",
        color: isActive ? "white" : "#cbd5e1",
        border: isActive
          ? "1px solid rgba(255, 255, 255, 0.2)"
          : "1px solid transparent",
        boxShadow: isActive ? "0 4px 12px rgba(99, 102, 241, 0.3)" : "none",
      })}
      onMouseEnter={(e) => {
        if (!e.currentTarget.classList.contains("active")) {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
          e.currentTarget.style.transform = "translateX(4px)";
        }
      }}
      onMouseLeave={(e) => {
        if (!e.currentTarget.classList.contains("active")) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.transform = "translateX(0)";
        }
      }}
    >
      <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
      {label}
    </NavLink>
  );
}
