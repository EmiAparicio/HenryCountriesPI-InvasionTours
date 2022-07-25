/* eslint-disable react-hooks/exhaustive-deps */
/////////////////////////////////////////////////////////////////////////////////////
// Imports
/////////////////////////////////////////////////////////////////////////////////////
// Packages
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

// Application files
import { ShowCountries } from "./ShowCountries";
import {
  setClearSearch,
  setFilterOptions,
  setStoredPage,
} from "../../../redux/actions";

/////////////////////////////////////////////////////////////////////////////////////
// Code
/////////////////////////////////////////////////////////////////////////////////////
// Component: divide shown countries in pages
export function Pagination({ showCountries }) {
  const dispatch = useDispatch();

  ///////////////////////////////////////////////////////////////////////////////////
  // Page changes reaction
  const storedPage = useSelector((state) => state.page);

  const navigate = useNavigate();
  useEffect(() => {
    // Navigate when page in store state changes
    navigate(`/home?page=${storedPage}`, { replace: true });
  }, [storedPage]);

  ///////////////////////////////////////////////////////////////////////////////////
  // Read page from query or store state
  function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
  }
  const query = useQuery().get("page");

  const page = useMemo(() => {
    return query ? Number(query) : storedPage;
  }, [query]);

  ///////////////////////////////////////////////////////////////////////////////////
  // HANDLERS
  // Change page when clicked from button
  function handlePage(e) {
    const newPage = Number(e.target.innerText);

    dispatch(setStoredPage(newPage));
  }

  // Clear filters and reset page when click "NoRes" button
  function handleClear() {
    dispatch(
      setFilterOptions({
        continent: "",
        activity: "",
      })
    );
    dispatch(setClearSearch(true));
    dispatch(setStoredPage(1));
  }

  ///////////////////////////////////////////////////////////////////////////////////
  // Pagination numbers array depending on showCountries length
  const paginationArray = Array.from(
    Array(Math.ceil((showCountries.length + 1) / 10) + 1).keys()
  );

  ///////////////////////////////////////////////////////////////////////////////////
  // Render
  ///////////////////////////////////////////////////////////////////////////////////
  return (
    <div>
      <div>
        {page < 1 || page >= paginationArray.length ? (
          <span>Página no válida</span> // When wrong page query in URL manually
        ) : showCountries.length ? (
          // Pagination buttons
          paginationArray.map((p, id) => {
            // Skip case "page 0"
            if (id > 0)
              // Show first, last, actual and ±1 pages
              return id === 1 ||
                id === paginationArray.length - 1 ||
                (id <= page + 1 && id >= page - 1) ? (
                <div key={id}>
                  {/* Button with page number */}
                  <button onClick={handlePage}>{p}</button>
                </div>
              ) : id <= page + 2 && id >= page - 2 ? ( // Pages ±2 buttons with "..."
                <div key={id}>...</div>
              ) : (
                // Doesn't display other pages buttons
                <React.Fragment key={id}></React.Fragment>
              );
            return <React.Fragment key={id}></React.Fragment>;
          })
        ) : (
          // Button: clears filters when no results are found
          <button name="NoRes" onClick={handleClear}>
            Sin resultados: Limpiar
          </button>
        )}
      </div>

      {/* Display countries */}
      <ShowCountries showCountries={showCountries} page={page} />
    </div>
  );
}
