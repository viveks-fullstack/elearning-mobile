import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartBarIcon from "../../../assets/svg/ChartBarIcon";

export default function ChartSection({ data }) {
  return (
    <div
      className="glass-card mt-4 animate-slide-in"
      style={{
        padding: "32px",
        borderRadius: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "30px",
        }}
      >
        <div>
          <h5 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
            Overview
          </h5>
          <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
            Performance metrics
          </p>
        </div>
        <div
          className="glass"
          style={{
            padding: "10px 20px",
            borderRadius: "12px",
            fontSize: "0.85rem",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <ChartBarIcon size={18} color="#667eea" /> Statistics
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            tick={{ fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <YAxis tick={{ fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
          <Tooltip
            contentStyle={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Bar
            dataKey="value"
            fill="url(#colorGradient)"
            radius={[12, 12, 0, 0]}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#667eea" stopOpacity={1} />
              <stop offset="100%" stopColor="#764ba2" stopOpacity={0.8} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
