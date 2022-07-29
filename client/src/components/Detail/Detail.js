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

// CSS
import detailMain from "../../styles/components/Detail/Detail.module.css";

const detail = detailMain; // detailMain invadedDetail

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
    <div className={`${detail.container}`}>
      {country ? (
        <>
          <div className={`${detail.detailContainer}`}>
            <div className={`${detail.flagContainer}`}>
              <img
                src={country?.flag}
                alt="country flag"
                className={`${detail.flag}`}
              />
            </div>
            <div className={`${detail.details}`}>
              <span>
                <span className={`${detail.span}`}>País: </span>
                {country?.name} ({country?.id})
              </span>
              <span>
                <span className={`${detail.span}`}>Capital: </span>
                {country?.capital}
              </span>
              <span>
                <span className={`${detail.span}`}>Área: </span>
                {country?.area} km²
              </span>
              <span>
                <span className={`${detail.span}`}>Población: </span>
                {country?.population}
              </span>
              <span>
                <span className={`${detail.span}`}>Continente: </span>
                {country?.continent}
              </span>

              {!country.Activities?.length ? (
                <span className={`${detail.span}`}>
                  Turismo: Sin actividades
                </span>
              ) : (
                <></>
              )}
            </div>
          </div>

          {/* Show activities if any */}
          {country.Activities?.length ? (
            <div>
              <span className={`${detail.span}`}>Turismo: </span>
              <div className={`${detail.activities}`}>
                {country?.Activities?.map((a, id) => {
                  return (
                    <div
                      key={id}
                      className={`${detail.details}`}
                      style={{ width: "300px" }}
                    >
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
            <div style={{ display: "none" }}></div>
          )}

          {/* Google Maps Component */}
          <Maps />
        </>
      ) : (
        // Error when wrong country id in URL params
        <span>No existe un país con el código {countryId}</span>
      )}
    </div>
  );
}
