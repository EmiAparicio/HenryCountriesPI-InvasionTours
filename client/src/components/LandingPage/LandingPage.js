/* eslint-disable react-hooks/exhaustive-deps */
////////////////////////////////////////////////////////////////////////////
// Imports
////////////////////////////////////////////////////////////////////////////
// Packages
import { Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

// Application files
// import { getInvadedCountries } from "../../controllers";
import {
  setOrderOptions,
  setFilterOptions,
  setStoredPage,
  setClearSearch,
  getCountries,
  setAlienMode,
  getInvadedCountries,
} from "../../redux/actions";

// CSS
import landingMain from "../../styles/components/LandingPage/LandingPage.module.css";
import invadedLanding from "../../styles/components/LandingPage/LandingPageI.module.css";
import planeButtonMain from "../../styles/images/planeButton.png";
import ovniButton from "../../styles/images/ovniButton.png";

let landing;
let button;

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

  //////////////////////////////////////////////////////////////////////////
  // Alien
  const activateCode = useSelector((state) => state.activateCode);
  const alienMode = useSelector((state) => state.alienMode);

  useEffect(() => {
    const storedMode = localStorage.getItem("alienMode") === "true";
    dispatch(setAlienMode(storedMode));
  }, []);

  button = useMemo(() => {
    return alienMode ? ovniButton : planeButtonMain;
  }, [alienMode]);
  landing = useMemo(() => {
    return alienMode ? invadedLanding : landingMain;
  }, [alienMode]);

  function handleKeyboard(e) {
    e.preventDefault();
    if (e.repeat) return;

    if ((e.metaKey || e.ctrlKey) && e.key === "x") {
      if (!(localStorage.getItem("alienMode") === "true")) {
        const code = window.prompt("Ingresa el código invertido:");
        if (code === activateCode) dispatch(setAlienMode(true));
        else if (code !== "" && code !== null)
          window.alert("Código desconocido...");
      }
    } else if ((e.metaKey || e.ctrlKey) && e.key === "z") {
      localStorage.removeItem("completedInvasion");
      localStorage.removeItem("game");

      dispatch(setAlienMode(false));
      dispatch(getInvadedCountries([], "disconnect"));
      dispatch(getCountries());

      localStorage.removeItem("usercode");
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboard);

    return () => document.removeEventListener("keydown", handleKeyboard);
  }, []);

  const completed = localStorage.getItem("completedInvasion");

  //////////////////////////////////////////////////////////////////////////
  // Render
  //////////////////////////////////////////////////////////////////////////
  return (
    <div
      className={
        completed ? `${landing.bgColorComplete}` : `${landing.bgColor}`
      }
    >
      <div
        className={
          completed ? `${landing.bgImageComplete}` : `${landing.bgImage}`
        }
      />
      <div className={`${landing.enter}`}>
        <Link to="/home" className={`${landing.link}`}>
          <img
            src={button}
            alt="Enter Button"
            className={`${landing.button}`}
          />
        </Link>
      </div>
    </div>
  );
}
