/**
 * Class List Table Columns Configuration
 */

import EditIcon from "../../assets/svg/EditIcon";
import DeleteIcon from "../../assets/svg/DeleteIcon";
import CopyIcon from "../../assets/svg/CopyIcon";
import RefreshIcon from "../../assets/svg/RefreshIcon";
import styles from "../../styles/Columns.module.css";

export const getClassColumns = (
  handleEdit,
  handleDelete,
  handleCopyLink,
  handleRegenerateLink,
) => [
  {
    header: "Title",
    accessor: "title",
  },
  {
    header: "Teacher",
    accessor: (row) => row.teacher?.name || "N/A",
  },
  {
    header: "Total Hours",
    accessor: (row) => `${row.totalHours || 0} hrs`,
  },
  {
    header: "Meeting Link",
    accessor: "meetingLink",
    cell: (row) => (
      <div className={styles.actionRow}>
        <>
          <button
            onClick={() => handleCopyLink(row)}
            className={`${styles.actionButton} ${styles.buttonInfo}`}
          >
            <CopyIcon size={16} color="white" /> Copy
          </button>
          <button
            onClick={() => handleRegenerateLink(row)}
            className={`${styles.actionButton} ${styles.buttonWarn}`}
          >
            <RefreshIcon size={16} color="white" /> Regen
          </button>
        </>
      </div>
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
