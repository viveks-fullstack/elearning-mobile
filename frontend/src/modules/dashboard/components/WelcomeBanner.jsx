export default function WelcomeBanner() {
  return (
    <div
      className="animate-slide-in"
      style={{
        padding: "35px 40px",
        borderRadius: "24px",
        marginBottom: "30px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        boxShadow:
          "0 10px 40px rgba(102, 126, 234, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          width: "250px",
          height: "250px",
          background: "rgba(255, 255, 255, 0.08)",
          borderRadius: "50%",
          top: "-80px",
          right: "-80px",
          filter: "blur(80px)",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <h3
          className="fw-bold mb-2"
          style={{
            color: "white",
            textShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          Welcome Back, Admin!
        </h3>
        <p
          className="mb-0"
          style={{
            color: "rgba(255, 255, 255, 0.95)",
            fontSize: "1.05rem",
          }}
        >
          Here's a summary of your coaching performance today.
        </p>
      </div>
    </div>
  );
}
