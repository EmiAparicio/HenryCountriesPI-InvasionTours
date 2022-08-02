import React from "react";

export function PageButton({
  id,
  page,
  pagination,
  handlePage,
  handleBack,
  handleNext,
  p,
  paginationArray,
}) {
  return (
    <>
      {id === 1 ? (
        <div>
          {/* Back button */}
          <button
            onClick={handleBack}
            disabled={page <= 1}
            className={
              page <= 1
                ? `${pagination.buttonDisabled}`
                : `${pagination.buttons}`
            }
          >
            {"<"}
          </button>
        </div>
      ) : (
        <></>
      )}
      <div>
        {/* Button with page number */}
        <button
          onClick={handlePage}
          className={
            id === page
              ? `${pagination.selectedPage} ${pagination.buttons}`
              : `${pagination.buttons}`
          }
        >
          {p}
        </button>
      </div>
      {id === paginationArray.length - 1 ? (
        <div>
          {/* Next button */}
          <button
            onClick={handleNext}
            disabled={page >= paginationArray.length - 1}
            className={
              page >= paginationArray.length - 1
                ? `${pagination.buttonDisabled}`
                : `${pagination.buttons}`
            }
          >
            {">"}
          </button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
