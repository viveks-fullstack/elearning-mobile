import { useEffect, useState } from "react";

export default function StatCard({ title, value, icon, color }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const increment = value / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(counter);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [value]);

  return (
    <div className="col-md-4">
      <div
        className="glass-card animate-fade-in"
        style={{
          padding: "28px",
          borderRadius: "20px",
          borderLeft: `5px solid ${color || "#6366f1"}`,
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted mb-1" style={{ fontSize: "0.9rem" }}>
              {title}
            </h6>
            <h2 className="fw-bold mb-0" style={{ color: "#1e293b" }}>
              {displayValue}
            </h2>
          </div>
          <div style={{ fontSize: "32px", opacity: 0.7 }}>{icon}</div>
        </div>
      </div>
    </div>
  );
}
