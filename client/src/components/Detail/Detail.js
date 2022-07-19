import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { getCountryDetail } from "../../redux/actions";
import { Activity } from "./Activity";

////////////////////////////////////////////////////////////////////////////////

export function Detail() {
  const { countryId } = useParams();
  const dispatch = useDispatch();

  const country = useSelector((state) => state.countryDetail);

  useEffect(() => {
    dispatch(getCountryDetail(countryId));
    return dispatch(getCountryDetail());
  }, [countryId, dispatch]);

  return (
    <>
      {country ? (
        <div>
          {" "}
          <span>
            País: {country?.name} ({country?.id})
          </span>
          <img src={country?.flag} alt="country flag" />
          <span>Capital: {country?.capital}</span>
          <span>Área: {country?.area} km²</span>
          <span>Población: {country?.population}</span>
          <span>Continente: {country?.continent}</span>
          <div>
            <span>Turismo: {!country.Activity ? "Sin actividades" : ""}</span>
            {country?.Activity?.map((a, id) => {
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
        <span>No existe un país con el código {countryId}</span>
      )}
    </>
  );
}