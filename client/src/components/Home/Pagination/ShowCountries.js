/* eslint-disable react-hooks/exhaustive-deps */
////////////////////////////////////////////////////////////////////////////////
// Imports
////////////////////////////////////////////////////////////////////////////////
// Packages
import React from "react";
import { useSelector } from "react-redux";

// Application files
import { Country } from "./Country";

// CSS
import planeButton from "../../../styles/images/planeButton.png";
import showCountriesMain from "../../../styles/components/Home/Pagination/ShowCountries.module.css";

const showC = showCountriesMain; // showCountriesMain invadedCountries

////////////////////////////////////////////////////////////////////////////////
// Code
////////////////////////////////////////////////////////////////////////////////
// Component: displays countries cards for Pagination.js
export function ShowCountries({ showCountries, page }) {
  const allCountries = useSelector((state) => state.allCountries);

  return (
    <div className={`${showC.container}`}>
      {/* Show plane in first page of all countries */}
      {showCountries.length === allCountries.length && page === 1 ? (
        <div className={`${showC.planeContainer}`}>
          <div className={`${showC.plane}`}>
            <img src={planeButton} alt="Plane" />
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
