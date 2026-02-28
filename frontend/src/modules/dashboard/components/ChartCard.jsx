import styles from "./DashboardCards.module.css";

export default function ChartCard({ title, children }) {
  return (
    <div className="col-12">
      <div className={`glass-card animate-fade-in ${styles.chartCard}`}>
        <h6 className={`fw-semibold mb-4 ${styles.chartTitle}`}>{title}</h6>
        {children}
      </div>
    </div>
  );
}
