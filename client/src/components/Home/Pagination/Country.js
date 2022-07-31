// Import packages
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setAlienMode } from "../../../redux/actions";

// CSS
import countryMain from "../../../styles/components/Home/Pagination/Country.module.css";
import invadedCountry from "../../../styles/components/Home/Pagination/CountryI.module.css";

// Component: country card for ShowCountries.js
export function Country({ name, continent, flag, id }) {
  // Alien
  const dispatch = useDispatch();

  const alienMode = useSelector((state) => state.alienMode);
  const storedMode =
    localStorage.getItem("alienMode") === "true";
  dispatch(setAlienMode(storedMode));

  let country = useMemo(() => {
    return alienMode ? invadedCountry : countryMain;
  }, [alienMode]);

  let signal = false;

  if (localStorage.getItem("game")){
    const invaded = JSON.parse(localStorage.getItem("invadedCountries"));

    if (invaded.find(i=>i.name===name)) signal = true;
  }

  // Render
  return (
    <div className={`${country.container}`}>
      <div className={`${country.flagContainer}`}>
        <Link to={`/country/${id}`} className={`${country.link}`}>
          <img
            src={flag}
            alt="country flag"
            className={signal ? `${country.signedFlag}` : `${country.flag}`}
          />
        </Link>
      </div>
      <span className={`${country.span}`}>
        Nombre: <br />
        <span>{name}</span>
      </span>
      <span className={`${country.span} ${country.spanContinent}`}>
        Continente: <span>{continent}</span>
      </span>
    </div>
  );
}
