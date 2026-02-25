/**
 * Pagination Component
 * Provides navigation controls for paginated data
 */

import PropTypes from "prop-types";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showInfo = true,
  totalItems = 0,
  itemsPerPage = 10,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className="d-flex align-items-center justify-content-between mt-4"
      style={{
        padding: "20px",
        background: "rgba(99, 102, 241, 0.03)",
        borderRadius: "16px",
      }}
    >
      {showInfo && (
        <div className="d-none d-sm-block">
          <p
            className="mb-0"
            style={{
              fontSize: "0.9rem",
              color: "#64748b",
              fontWeight: 500,
            }}
          >
            Showing{" "}
            <span style={{ fontWeight: 600, color: "#1e293b" }}>
              {startItem}
            </span>{" "}
            to{" "}
            <span style={{ fontWeight: 600, color: "#1e293b" }}>{endItem}</span>{" "}
            of{" "}
            <span style={{ fontWeight: 600, color: "#1e293b" }}>
              {totalItems}
            </span>{" "}
            results
          </p>
        </div>
      )}

      <div className="d-flex">
        <nav className="d-inline-flex gap-1" aria-label="Pagination">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: "8px 14px",
              fontSize: "0.9rem",
              fontWeight: 500,
              border: "1px solid rgba(99, 102, 241, 0.2)",
              borderRadius: "10px",
              background: "white",
              color: currentPage === 1 ? "#cbd5e1" : "#6366f1",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              opacity: currentPage === 1 ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 1) {
                e.currentTarget.style.background = "rgba(99, 102, 241, 0.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 1) {
                e.currentTarget.style.background = "white";
              }
            }}
          >
            ←
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                style={{
                  padding: "8px 12px",
                  fontSize: "0.9rem",
                  color: "#94a3b8",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                style={{
                  padding: "8px 14px",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  border:
                    currentPage === page
                      ? "none"
                      : "1px solid rgba(99, 102, 241, 0.2)",
                  borderRadius: "10px",
                  background:
                    currentPage === page
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "white",
                  color: currentPage === page ? "white" : "#64748b",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow:
                    currentPage === page
                      ? "0 4px 12px rgba(102, 126, 234, 0.3)"
                      : "none",
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.background =
                      "rgba(99, 102, 241, 0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.background = "white";
                  }
                }}
              >
                {page}
              </button>
            ),
          )}

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: "8px 14px",
              fontSize: "0.9rem",
              fontWeight: 500,
              border: "1px solid rgba(99, 102, 241, 0.2)",
              borderRadius: "10px",
              background: "white",
              color: currentPage === totalPages ? "#cbd5e1" : "#6366f1",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              opacity: currentPage === totalPages ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (currentPage !== totalPages) {
                e.currentTarget.style.background = "rgba(99, 102, 241, 0.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== totalPages) {
                e.currentTarget.style.background = "white";
              }
            }}
          >
            →
          </button>
        </nav>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  showInfo: PropTypes.bool,
  totalItems: PropTypes.number,
  itemsPerPage: PropTypes.number,
};

export default Pagination;
