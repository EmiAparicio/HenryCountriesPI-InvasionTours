/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Country } from "./Country";

export function ShowCountries({ showCountries, page }) {
  return (
    <div>
      {showCountries.map((country, id) => {
        if (
          id >= (page - 1 === 0 ? 0 : (page - 1) * 10 - 1) &&
          id <= (page - 1 === 0 ? 8 : (page - 1) * 10 + 8)
        )
          return (
            <div key={id}>
              <Country
                name={country.name}
                continent={country.continent}
                // flag={country.flag}
                population={country.population}
                id={country.id}
              />
            </div>
          );
        return <React.Fragment key={id}></React.Fragment>;
      })}
    </div>
  );
}
