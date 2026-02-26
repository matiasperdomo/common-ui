import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  windowSize = 9,
  className = '',
  ariaLabel = 'Paginación'
}) => {
  const safeTotalPages = totalPages || 1;
  const safeCurrentPage = currentPage || 1;

  if (safeTotalPages <= 1) return null;

  const halfWindow = Math.floor(windowSize / 2);

  let startPage = Math.max(1, safeCurrentPage - halfWindow);
  let endPage = Math.min(safeTotalPages, startPage + windowSize - 1);

  if (endPage - startPage + 1 < windowSize) {
    startPage = Math.max(1, endPage - windowSize + 1);
  }

  const visiblePages = [];
  for (let i = startPage; i <= endPage; i += 1) {
    visiblePages.push(i);
  }

  const handleChange = (page) => {
    if (page === safeCurrentPage) return;
    if (page < 1 || page > safeTotalPages) return;
    onPageChange(page);
  };

  return (
    <nav className={className} aria-label={ariaLabel}>
      <ul className="pagination flex-wrap justify-content-center">
        {safeCurrentPage > 1 && (
          <>
            <li className="page-item">
              <button
                type="button"
                className="page-link"
                onClick={() => handleChange(1)}
                aria-label="Primera página"
              >
                &laquo;
              </button>
            </li>
            <li className="page-item">
              <button
                type="button"
                className="page-link"
                onClick={() => handleChange(safeCurrentPage - 1)}
                aria-label="Página anterior"
              >
                &lsaquo;
              </button>
            </li>
          </>
        )}

        {startPage > 1 && (
          <li className="page-item disabled">
            <span className="page-link">…</span>
          </li>
        )}

        {visiblePages.map((page) => (
          <li
            key={page}
            className={`page-item ${page === safeCurrentPage ? 'active' : ''}`}
          >
            <button
              type="button"
              className="page-link"
              onClick={() => handleChange(page)}
              aria-current={page === safeCurrentPage ? 'page' : undefined}
            >
              {page}
            </button>
          </li>
        ))}

        {endPage < safeTotalPages && (
          <li className="page-item disabled">
            <span className="page-link">…</span>
          </li>
        )}

        {safeCurrentPage < safeTotalPages && (
          <>
            <li className="page-item">
              <button
                type="button"
                className="page-link"
                onClick={() => handleChange(safeCurrentPage + 1)}
                aria-label="Página siguiente"
              >
                &rsaquo;
              </button>
            </li>
            <li className="page-item">
              <button
                type="button"
                className="page-link"
                onClick={() => handleChange(safeTotalPages)}
                aria-label="Última página"
              >
                &raquo;
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  windowSize: PropTypes.number,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default Pagination;
