import EmptyState from "./EmptyState";

export default function DataTable({
  columns,
  data,
  emptyStateType = "default",
  emptyStateTitle,
  emptyStateMessage,
}) {
  return (
    <>
      <table
        className="table table-hover align-middle"
        style={{
          borderCollapse: "separate",
          borderSpacing: "0",
        }}
      >
        <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                style={{
                  fontWeight: 600,
                  color: "#475569",
                  fontSize: "0.85rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  padding: "16px 12px",
                  background: "rgba(99, 102, 241, 0.05)",
                  borderBottom: "2px solid rgba(99, 102, 241, 0.1)",
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center"
                style={{ padding: "40px 20px" }}
              >
                <EmptyState
                  type={emptyStateType}
                  title={emptyStateTitle}
                  message={emptyStateMessage}
                />
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={index}
                style={{
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(99, 102, 241, 0.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.accessor}
                    style={{
                      padding: "18px 12px",
                      fontSize: "0.9rem",
                      color: "#334155",
                      borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
                    }}
                  >
                    {col.cell ? col.cell(row) : row[col.accessor] || "-"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
