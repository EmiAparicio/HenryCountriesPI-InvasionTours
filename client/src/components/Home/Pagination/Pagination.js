/* eslint-disable react-hooks/exhaustive-deps */
/////////////////////////////////////////////////////////////////////////////////////
// Imports
/////////////////////////////////////////////////////////////////////////////////////
// Packages
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Application files
import { ShowCountries } from "./ShowCountries";
import {
  setAlienMode,
  setClearSearch,
  setFilterOptions,
  setStoredPage,
} from "../../../redux/actions";

// CSS
import paginationMain from "../../../styles/components/Home/Pagination/Pagination.module.css";
import invadedPagination from "../../../styles/components/Home/Pagination/PaginationI.module.css";
import { PageButton } from "./PageButton";

/////////////////////////////////////////////////////////////////////////////////////
// Code
/////////////////////////////////////////////////////////////////////////////////////
// Component: divide shown countries in pages
export function Pagination({ showCountries }) {
  const dispatch = useDispatch();
  const allCountries = useSelector((state) => state.allCountries);

  // Alien
  const alienMode = useSelector((state) => state.alienMode);
  const storedMode =
    localStorage.getItem("alienMode") === "true" ? true : false;
  dispatch(setAlienMode(storedMode));

  let pagination = useMemo(() => {
    return alienMode ? invadedPagination : paginationMain;
  }, [alienMode]);

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
    if (query) dispatch(setStoredPage(Number(query)));
    return query ? Number(query) : storedPage;
  }, [query]);

  ///////////////////////////////////////////////////////////////////////////////////
  // HANDLERS
  // Change page when clicked from button
  function handlePage(e) {
    const newPage = Number(e.target.innerText);

    dispatch(setStoredPage(newPage));
  }

  function handleBack(e) {
    const newPage = page > 1 ? page - 1 : page;
    dispatch(setStoredPage(newPage));
  }

  function handleNext(e) {
    const newPage = page < paginationArray.length - 1 ? page + 1 : page;
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
  const outOfPagination = page < 1 || page >= paginationArray.length;

  function showPage(id) {
    return (
      id === 1 ||
      id === paginationArray.length - 1 ||
      // (id >= page - 1 && id <= page + 1)
      id === page
    );
  }

  function hidePage(id, page) {
    return id <= page + 1 && id >= page - 1;
  }

  return (
    <div className={`${pagination.container}`}>
      <div className={`${pagination.pagesContainer}`}>
        {outOfPagination ? (
          <Link to="/home?page=1" className={`${pagination.noPageLink}`}>
            Página no válida
          </Link> // When wrong page query in URL manually
        ) : showCountries.length ? (
          // Pagination buttons
          paginationArray.map((p, id) => {
            // Skip case "page 0"
            if (id > 0)
              // Show first, last, actual and ±1 pages
              return showPage(id) ? (
                <PageButton
                  key={id}
                  id={id}
                  page={page}
                  handlePage={handlePage}
                  p={p}
                  pagination={pagination}
                  paginationArray={paginationArray}
                  handleBack={handleBack}
                  handleNext={handleNext}
                />
              ) : hidePage(id, page) ? ( // Pages ±2 buttons with "..."
                <div key={id} className={`${pagination.pages}`}>
                  ...
                </div>
              ) : (
                // Doesn't display other pages buttons
                <React.Fragment key={id}></React.Fragment>
              );
            else return <React.Fragment key={id}></React.Fragment>;
          })
        ) : (
          // Button: clears filters when no results are found
          <div className={`${pagination.noResultsContainer}`}>
            {allCountries.length ? (
              <button
                name="NoRes"
                onClick={handleClear}
                className={`${pagination.noResults}`}
              >
                Sin resultados: Limpiar
              </button>
            ) : (
              <span className={`${pagination.loading}`}>Cargando datos...</span>
            )}
          </div>
        )}
      </div>

      {/* Display countries */}
      <ShowCountries showCountries={showCountries} page={page} />
    </div>
  );
}
