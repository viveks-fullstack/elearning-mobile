export default function KpiCard({ title, value, icon, color }) {
  return (
    <div className="col-md-3">
      <div
        className="glass-card animate-slide-in"
        style={{
          padding: "28px",
          borderRadius: "20px",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          minHeight: "160px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow =
            "0 16px 48px rgba(31, 38, 135, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(31, 38, 135, 0.1)";
        }}
      >
        {/* Icon Circle */}
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "16px",
            background: `linear-gradient(135deg, ${color}, ${color}cc)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.8rem",
            marginBottom: "20px",
            boxShadow: `0 8px 24px ${color}40`,
          }}
        >
          {icon}
        </div>

        <div>
          <h6
            className="text-muted mb-2"
            style={{
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            {title}
          </h6>
          <h2
            className="fw-bold mb-0"
            style={{
              color: "#1e293b",
              fontSize: "2rem",
            }}
          >
            {value}
          </h2>
        </div>

        {/* Decorative element */}
        <div
          style={{
            position: "absolute",
            width: "100px",
            height: "100px",
            background: `${color}15`,
            borderRadius: "50%",
            bottom: "-30px",
            right: "-30px",
            filter: "blur(20px)",
          }}
        />
      </div>
    </div>
  );
}
