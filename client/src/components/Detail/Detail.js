////////////////////////////////////////////////////////////////////////////////
// Imports
////////////////////////////////////////////////////////////////////////////////
// Packages
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Application files
import { getCountryDetail, setAlienMode } from "../../redux/actions";
import { Activity } from "./Activity";
import { Maps } from "./Maps";

// CSS
import detailMain from "../../styles/components/Detail/Detail.module.css";
import invadedDetail from "../../styles/components/Detail/DetailI.module.css";

import ovniButton from "../../styles/images/ovniButton.png";

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

  //////////////////////////////////////////////////////////////////////////////
  // Alien
  const completed = localStorage.getItem("completedInvasion");

  const alienMode = useSelector((state) => state.alienMode);
  const storedMode = localStorage.getItem("alienMode") === "true";
  dispatch(setAlienMode(storedMode));

  let detail = useMemo(() => {
    return alienMode ? invadedDetail : detailMain;
  }, [alienMode]);

  let NEILAinvaded = false;
  if (alienMode && country.Invasions?.find((i) => i.name === "NEILA")) {
    NEILAinvaded = true;
  }

  // Render
  return (
    <>
      {country?.msj ? (
        <span className={`${detail.loading}`}>
          No existe un país con el código {countryId}
        </span>
      ) : (
        <div className={`${detail.container}`}>
          {country?.flag ? (
            <>
              <div className={`${detail.detailContainer}`}>
                <div className={`${detail.flagContainer}`}>
                  <img
                    src={country?.flag}
                    alt="country flag"
                    className={`${detail.flag}`}
                  />
                  <img
                    src={ovniButton}
                    alt="ovni"
                    className={
                      NEILAinvaded || completed
                        ? `${detail.ovni}`
                        : `${detail.ovniHidden}`
                    }
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
                  <span>
                    <span className={`${detail.span}`}>Subregión: </span>
                    {country?.subregion}
                  </span>

                  {!(
                    country.Activities?.length ||
                    (alienMode && country.Invasions?.length)
                  ) ? (
                    <span className={`${detail.span}`}>
                      {alienMode
                        ? "Invasión: Sin planes"
                        : "Turismo: Sin actividades"}
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              {/* Show activities if any */}
              {country.Activities?.length ||
              (alienMode && country.Invasions?.length) ? (
                <div>
                  <span className={`${detail.span}`}>
                    {alienMode ? "Invasión" : "Turismo"}:{" "}
                  </span>
                  <div className={`${detail.activities}`}>
                    {alienMode
                      ? country?.Invasions?.map((a, id) => {
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
                        })
                      : country?.Activities?.map((a, id) => {
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
            <span className={`${detail.loading}`}>Cargando datos...</span>
          )}
        </div>
      )}
    </>
  );
}
