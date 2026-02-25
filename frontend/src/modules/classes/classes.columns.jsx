/**
 * Class List Table Columns Configuration
 */

import EditIcon from "../../assets/svg/EditIcon";
import DeleteIcon from "../../assets/svg/DeleteIcon";
import CopyIcon from "../../assets/svg/CopyIcon";
import RefreshIcon from "../../assets/svg/RefreshIcon";

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
      <div style={{ display: "flex", gap: "8px" }}>
        {row.meetingLink && (
          <>
            <button
              onClick={() => handleCopyLink(row.meetingLink)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "none",
                background: "#06b6d4",
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
                  "0 4px 12px rgba(6, 182, 212, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <CopyIcon size={16} color="white" /> Copy
            </button>
            <button
              onClick={() => handleRegenerateLink(row)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "none",
                background: "#f59e0b",
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
                  "0 4px 12px rgba(245, 158, 11, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <RefreshIcon size={16} color="white" /> Regen
            </button>
          </>
        )}
      </div>
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
