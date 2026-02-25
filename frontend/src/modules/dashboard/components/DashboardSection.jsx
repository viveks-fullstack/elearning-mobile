export default function DashboardSection({ children }) {
  return (
    <div className="container-fluid mt-4">
      <div className="row g-4">{children}</div>
    </div>
  );
}
