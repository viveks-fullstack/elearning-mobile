export default function ChartCard({ title, children }) {
  return (
    <div className="col-12">
      <div
        className="glass-card animate-fade-in"
        style={{
          padding: "28px",
          borderRadius: "20px",
        }}
      >
        <h6 className="fw-semibold mb-4" style={{ color: "#1e293b" }}>
          {title}
        </h6>
        {children}
      </div>
    </div>
  );
}
