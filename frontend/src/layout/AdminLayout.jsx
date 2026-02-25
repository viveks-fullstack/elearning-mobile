import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div
        style={{
          flex: 1,
          background: "#f8fafc",
          position: "relative",
        }}
      >
        <Topbar />
        <div style={{ padding: "0" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
