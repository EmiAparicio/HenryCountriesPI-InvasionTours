/* eslint-disable react-hooks/exhaustive-deps */
////////////////////////////////////////////////////////////////////////////
// Imports
////////////////////////////////////////////////////////////////////////////
// Packages
import { Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

// Application files
import {
  setOrderOptions,
  setFilterOptions,
  setStoredPage,
  setClearSearch,
  getCountries,
} from "../../redux/actions";

// CSS
import landingMain from "../../styles/components/LandingPage/LandingPage.module.css";
import invadedLanding from "../../styles/components/LandingPage/LandingPageI.module.css";
import planeButtonMain from "../../styles/images/planeButton.png";
import ovniButton from "../../styles/images/ovniButton.png";
import { setAlienMode } from "../../redux/actions";

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
  const activateCode = useSelector((state) => state.activateCode);
  const alienMode = useSelector((state) => state.alienMode);

  useEffect(() => {
    const storedMode = localStorage.getItem("alienMode");
    if (storedMode === "true") dispatch(setAlienMode(true));
  }, []);

  const mode = useMemo(() => {
    return alienMode;
  }, [alienMode]);

  const handleKeyboard = (e) => {
    e.preventDefault();
    if (e.repeat) return;

    // Handle both, `ctrl` and `meta`.
    if ((e.metaKey || e.ctrlKey) && e.key === "x") {
      const code = window.prompt("Ingresa el código invertido:");
      if (code === activateCode) dispatch(setAlienMode(true));
      else if (code !== "" && code !== null)
        window.alert("Código desconocido...");
    } else if ((e.metaKey || e.ctrlKey) && e.key === "z") {
      dispatch(setAlienMode(false));
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboard);

    return () => document.removeEventListener("keydown", handleKeyboard);
  });

  const landing = useMemo(() => {
    return mode ? invadedLanding : landingMain;
  }, [mode]);
  const planeButton = useMemo(() => {
    return mode ? ovniButton : planeButtonMain;
  }, [mode]);

  //////////////////////////////////////////////////////////////////////////
  // Render
  //////////////////////////////////////////////////////////////////////////
  return (
    <div className={`${landing.bgColor}`}>
      <div className={`${landing.bgImage}`} />
      <div className={`${landing.enter}`}>
        <Link to="/home" className={`${landing.link}`}>
          <img
            src={planeButton}
            alt="Enter Button"
            className={`${landing.button}`}
          />
        </Link>
      </div>
    </div>
  );
}
