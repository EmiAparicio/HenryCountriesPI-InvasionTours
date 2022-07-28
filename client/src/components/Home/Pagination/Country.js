// Import packages
import { Link } from "react-router-dom";

// CSS
import countryMain from "../../../styles/components/Home/Pagination/Country.module.css";

const country = countryMain; // countryMain invadedCountry

// Component: country card for ShowCountries.js
export function Country({ name, continent, flag, id }) {
  return (
    <div className={`${country.container}`}>
      <div className={`${country.flagContainer}`}>
        <Link to={`/country/${id}`} className={`${country.link}`}>
          <img src={flag} alt="country flag" className={`${country.flag}`} />
        </Link>
      </div>
      <span className={`${country.span} ${country.spanFix}`}>
        Nombre: <br />
        <span>{name}</span>
      </span>
      <span className={`${country.span} ${country.spanContinent}`}>
        Continente: <span>{continent}</span>
      </span>
    </div>
  );
}
