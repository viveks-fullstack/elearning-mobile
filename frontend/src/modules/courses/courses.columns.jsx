/**
 * Course List Table Columns Configuration
 */

import EditIcon from "../../assets/svg/EditIcon";
import DeleteIcon from "../../assets/svg/DeleteIcon";

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
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={() => handleEdit(row)}
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            border: "none",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.85rem",
            fontWeight: 500,
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(102, 126, 234, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <EditIcon size={16} color="white" /> Edit
        </button>
        <button
          onClick={() => handleDelete(row)}
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            border: "none",
            background: "#ef4444",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.85rem",
            fontWeight: 500,
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(239, 68, 68, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <DeleteIcon size={16} color="white" /> Delete
        </button>
      </div>
    ),
  },
];
