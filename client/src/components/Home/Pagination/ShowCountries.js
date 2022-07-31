/* eslint-disable react-hooks/exhaustive-deps */
////////////////////////////////////////////////////////////////////////////////
// Imports
////////////////////////////////////////////////////////////////////////////////
// Packages
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

// Application files
import { Country } from "./Country";

// CSS
import planeButton from "../../../styles/images/planeButton.png";
import ovniButton from "../../../styles/images/ovniButton.png";
import showCountriesMain from "../../../styles/components/Home/Pagination/ShowCountries.module.css";
import invadedShowCountries from "../../../styles/components/Home/Pagination/ShowCountriesI.module.css";
import { setAlienMode } from "../../../redux/actions";

////////////////////////////////////////////////////////////////////////////////
// Code
////////////////////////////////////////////////////////////////////////////////
// Component: displays countries cards for Pagination.js
export function ShowCountries({ showCountries, page }) {
  const allCountries = useSelector((state) => state.allCountries);

  // Alien
  const dispatch = useDispatch();

  const alienMode = useSelector((state) => state.alienMode);
  const storedMode =
    localStorage.getItem("alienMode") === "true" ? true : false;
  dispatch(setAlienMode(storedMode));

  let showC = useMemo(() => {
    return alienMode ? invadedShowCountries : showCountriesMain;
  }, [alienMode]);
  let button = useMemo(() => {
    return alienMode ? ovniButton : planeButton;
  }, [alienMode]);

  return (
    <div className={`${showC.container}`}>
      {/* Show plane in first page of all countries */}
      {showCountries.length === allCountries.length && page === 1 ? (
        <div className={`${showC.planeContainer}`}>
          <div className={`${showC.plane}`}>
            <img src={button} alt="Plane" />
          </div>
        </div>
      ) : (
        <></>
      )}
      {showCountries.map((country, id) => {
        if (
          // Show countries depending on actual page
          id >= (page - 1 === 0 ? 0 : (page - 1) * 10 - 1) &&
          id <= (page - 1 === 0 ? 8 : (page - 1) * 10 + 8)
        )
          return (
            <Country
              name={country.name}
              continent={country.continent}
              flag={country.flag}
              population={country.population}
              id={country.id}
              key={id}
            />
          );
        return <React.Fragment key={id}></React.Fragment>;
      })}
    </div>
  );
}
