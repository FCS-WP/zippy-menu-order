import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import Button from "./button/Button";

/**
 * Reusable Pagination component with First / Last buttons
 * @param {number} currentPage - the current active page
 * @param {number} totalPages - total number of pages
 * @param {function} onPageChange - function to handle page switching
 */

const PaginationFE = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 2;
    if (totalPages <= maxPagesToShow + 2) {
      // if there are less than 5 pages, show them all
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const left = Math.max(2, currentPage - 1);
      const right = Math.min(totalPages - 1, currentPage + 1);

      pages.push(1);
      if (left > 2) pages.push("...");
      for (let i = left; i <= right; i++) pages.push(i);
      if (right < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
      <div className="text-sm text-gray-600">
        Page <span className="font-semibold">{currentPage}</span> of{" "}
        <span className="font-semibold">{totalPages}</span>
      </div>

      <div className="flex items-center gap-4 space-x-2">
        {/* First */}
        <Button
          className={`rounded bg-gray-200 hover:bg-gray-300 ${
            currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
        >
          <FontAwesomeIcon icon={faAnglesLeft} />
        </Button>

        {/* Previous */}
        <Button
          className={`rounded bg-gray-200 hover:bg-gray-300 ${
            currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>

        {/* Page numbers with ellipsis */}
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-6 py-1">
              ...
            </span>
          ) : (
            <Button
              key={index}
              className={`rounded ${
                currentPage === page
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => goToPage(page)}
            >
              {page}
            </Button>
          ),
        )}

        {/* Next */}
        <Button
          className={`rounded bg-gray-200 hover:bg-gray-300 ${
            currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>

        {/* Last */}
        <Button
          className={`rounded bg-gray-200 hover:bg-gray-300 ${
            currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          <FontAwesomeIcon icon={faAnglesRight} />
        </Button>
      </div>
    </div>
  );
};

PaginationFE.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default PaginationFE;
