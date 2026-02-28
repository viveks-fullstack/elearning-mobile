/**
 * Course List Table Columns Configuration
 */

import EditIcon from "../../assets/svg/EditIcon";
import DeleteIcon from "../../assets/svg/DeleteIcon";
import styles from "../../styles/Columns.module.css";

export const getCourseColumns = (handleEdit, handleDelete) => [
  {
    header: "Title",
    accessor: "title",
  },
  {
    header: "Code",
    accessor: (row) => row.code || "N/A",
  },
  {
    header: "Teacher",
    accessor: (row) => row.teacher?.name || "N/A",
  },
  {
    header: "Duration",
    accessor: (row) => `${row.duration || 0} hrs`,
  },
  {
    header: "Level",
    accessor: (row) => (
      <span
        className={`badge bg-${
          row.level === "beginner"
            ? "success"
            : row.level === "intermediate"
              ? "warning"
              : "danger"
        }`}
      >
        {row.level}
      </span>
    ),
  },
  {
    header: "Actions",
    accessor: "actions",
    cell: (row) => (
      <div className={styles.actionRow}>
        <button
          onClick={() => handleEdit(row)}
          className={`${styles.actionButton} ${styles.buttonEdit}`}
        >
          <EditIcon size={16} color="white" /> Edit
        </button>
        <button
          onClick={() => handleDelete(row)}
          className={`${styles.actionButton} ${styles.buttonDelete}`}
        >
          <DeleteIcon size={16} color="white" /> Delete
        </button>
      </div>
    ),
  },
];
