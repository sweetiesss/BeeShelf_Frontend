import { CaretLeft, CaretRight } from "@phosphor-icons/react"; // Replace with your actual icons
import { useEffect, useState } from "react";

export default function Pagination({
  currentPage,
  response,
  handleLeft,
  handleRight,
  handleChoose,
}) {
  console.log(response);
  
  function createPaginationArray(currentPage, totalPagesCount) {
    const paginationArray = [];
    const maxVisiblePages = 5;

    if (totalPagesCount <= maxVisiblePages) {
      return Array.from({ length: totalPagesCount }, (_, i) => i + 1);
    }
    paginationArray.push(1);
    if (currentPage > 3) {
      paginationArray.push("...");
    }
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPagesCount - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      paginationArray.push(i);
    }
    if (currentPage < totalPagesCount - 2) {
      paginationArray.push("...");
    }
    paginationArray.push(totalPagesCount);
    return paginationArray;
  }
  const paginationArray = createPaginationArray(
    currentPage,
    response?.totalPagesCount
  );
  return (
    <div className="flex items-center space-x-3">
      <button
        className={` ${!response?.previous ? "hidden" : "block"}`}
        onClick={handleLeft}
        disabled={!response?.previous}
      >
        <CaretLeft />
      </button>

      <div className="flex space-x-3">
        {paginationArray.map((page, index) =>
          page === "..." ? (
            <span key={index} className="flex space-x-2">
              <p>.</p>
              <p>.</p>
              <p>.</p>
            </span>
          ) : (
            <button
              key={index}
              className={`${page === currentPage ? "font-bold" : "font-light"}`}
              onClick={() => handleChoose(page - 1)}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        className={` ${!response?.next ? "hidden" : "block"}`}
        onClick={handleRight}
        disabled={!response?.next}
      >
        <CaretRight />
      </button>
    </div>
  );
}
