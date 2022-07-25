/* eslint-disable react-hooks/exhaustive-deps */
////////////////////////////////////////////////////////////////////////////
// Imports
////////////////////////////////////////////////////////////////////////////
// Packages
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Application files
import {
  setOrderOptions,
  setFilterOptions,
  setStoredPage,
  setClearSearch,
  getCountries,
} from "../../redux/actions";

////////////////////////////////////////////////////////////////////////////
// Code
////////////////////////////////////////////////////////////////////////////
// Component: prepares data and leads to the main function Home
export function LandingPage() {
  const dispatch = useDispatch();

  const allCountries = useSelector((state) => state.allCountries);

  // Reset filters, pagination, and gets data from db
  useEffect(() => {
    if (!allCountries.length) dispatch(getCountries());
    dispatch(setOrderOptions([]));
    dispatch(
      setFilterOptions({
        continent: "",
        activity: "",
      })
    );
    dispatch(setClearSearch(true));
    dispatch(setStoredPage(1));
  }, []);

  // Alien surprise
  const handleKeyboard = (e) => {
    e.preventDefault();
    if (e.repeat) return;

    // Handle both, `ctrl` and `meta`.
    if (e.metaKey || e.ctrlKey) console.log(e.key);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboard);

    return () => document.removeEventListener("keydown", handleKeyboard);
  });

  //////////////////////////////////////////////////////////////////////////
  // Render
  //////////////////////////////////////////////////////////////////////////
  return (
    <div>
      <Link to="/home">Home</Link>
    </div>
  );
}
