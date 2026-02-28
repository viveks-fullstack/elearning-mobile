/**
 * Pagination Component
 * Provides navigation controls for paginated data
 */

import PropTypes from "prop-types";
import styles from "./Pagination.module.css";

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
      className={`d-flex align-items-center justify-content-between ${styles.paginationContainer}`}
    >
      {showInfo && (
        <div className="d-none d-sm-block">
          <p className={`mb-0 ${styles.paginationInfo}`}>
            Showing <span className={styles.infoText}>{startItem}</span> to{" "}
            <span className={styles.infoText}>{endItem}</span> of{" "}
            <span className={styles.infoText}>{totalItems}</span> results
          </p>
        </div>
      )}

      <div className="d-flex">
        <nav
          className={`d-inline-flex ${styles.paginationButtons}`}
          aria-label="Pagination"
        >
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${styles.pageButton} ${currentPage === 1 ? styles.pageNumberDisabled : ""}`}
          >
            ←
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`${styles.pageNumber} ${currentPage === page ? styles.pageNumberActive : ""}`}
              >
                {page}
              </button>
            ),
          )}

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${styles.pageButton} ${currentPage === totalPages ? styles.pageNumberDisabled : ""}`}
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
