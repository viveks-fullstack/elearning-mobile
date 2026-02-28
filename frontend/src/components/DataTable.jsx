import EmptyState from "./EmptyState";
import styles from "./DataTable.module.css";

export default function DataTable({
  columns,
  data,
  emptyStateType = "default",
  emptyStateTitle,
  emptyStateMessage,
}) {
  return (
    <>
      <table className={`table table-hover align-middle ${styles.table}`}>
        <thead className={styles.thead}>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor} className={styles.th}>
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
                className={`text-center ${styles.emptyState}`}
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
              <tr key={index} className={styles.tr}>
                {columns.map((col) => (
                  <td key={col.accessor} className={styles.td}>
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
