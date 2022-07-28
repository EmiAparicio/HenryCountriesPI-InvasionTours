////////////////////////////////////////////////////////////////////////////////
// Imports
////////////////////////////////////////////////////////////////////////////////
// Packages
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Application files
import { getCountryDetail } from "../../redux/actions";
import { Activity } from "./Activity";
import { Maps } from "./Maps";

////////////////////////////////////////////////////////////////////////////////
// Code
////////////////////////////////////////////////////////////////////////////////
// Component: shows all information from a selected country by params.id
export function Detail() {
  const { countryId } = useParams();
  const dispatch = useDispatch();

  const country = useSelector((state) => state.countryDetail);

  useEffect(() => {
    dispatch(getCountryDetail(countryId));
    return () => dispatch(getCountryDetail());
  }, [countryId, dispatch]);

  // Render
  return (
    <div>
      {country ? (
        <div>
          <span>
            País: {country?.name} ({country?.id})
          </span>
          <img src={country?.flag} alt="country flag" />
          <span>Capital: {country?.capital}</span>
          <span>Área: {country?.area} km²</span>
          <span>Población: {country?.population}</span>
          <span>Continente: {country?.continent}</span>
          <div>
            {/* Show activities if any */}
            <span>Turismo: {!country.Activities ? "Sin actividades" : ""}</span>

            {country?.Activities?.map((a, id) => {
              return (
                <div key={id}>
                  <Activity
                    name={a.name}
                    difficulty={a.difficulty}
                    duration={a.duration}
                    season={a.season}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Error when wrong country id in URL params
        <span>No existe un país con el código {countryId}</span>
      )}

      {/* Google Maps Component */}
      <Maps />
    </div>
  );
}
