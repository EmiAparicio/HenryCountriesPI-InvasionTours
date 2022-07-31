/* eslint-disable react-hooks/exhaustive-deps */
////////////////////////////////////////////////////////////////////////////
// Imports
////////////////////////////////////////////////////////////////////////////
// Packages
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";

// Application files
import { createActivity, setAlienMode } from "../../redux/actions";

// CSS
import activityMain from "../../styles/components/Activities/CreatedActivities.module.css";
import invadedActivity from "../../styles/components/Activities/CreatedActivitiesI.module.css";

////////////////////////////////////////////////////////////////////////////
// Code
////////////////////////////////////////////////////////////////////////////
// Component: pop-ups when a new activity is created/associated to a country
export function CreatedActivities({
  name,
  difficulty,
  duration,
  season,
  countries,
}) {
  const dispatch = useDispatch();
  const createdActivity = useSelector((state) => state.createdActivity);

  // Alien
  const alienMode = useSelector((state) => state.alienMode);
  const storedMode =
    localStorage.getItem("alienMode") === "true" ? true : false;
  dispatch(setAlienMode(storedMode));

  let activityStyle = useMemo(() => {
    return alienMode ? invadedActivity : activityMain;
  }, [alienMode]);

  // Removes related countries from localStorage, added by Form.js
  function handleClose() {
    dispatch(createActivity());
  }

  // Automatically closes component after 15 secs
  let closeProcess = null;
  useEffect(() => {
    closeProcess = setInterval(() => handleClose(), 300000);
  }, [closeProcess]);

  useEffect(() => {
    if (!createActivity.name) {
      clearInterval(closeProcess);
      handleClose();
    }
  }, [createdActivity]);

  // Makes sure localStorage cleaning is getting done when leaving page
  useEffect(() => {
    localStorage.removeItem("countriesId");
    return () => {
      clearInterval(closeProcess);
      handleClose();
    };
  }, []);

  // Render
  return (
    <div className={`${activityStyle.container}`}>
      <button onClick={handleClose} className={`${activityStyle.button}`}>
        Cerrar
      </button>
      <span>
        {alienMode ? "Ejecución" : "Actividad"}: {name}
      </span>
      <span>
        {" "}
        Dificultad:{" "}
        {difficulty === 1
          ? alienMode
            ? "Reconocimiento"
            : "Visita"
          : difficulty === 2
          ? alienMode
            ? "Encuentro cercano"
            : "Esparcimiento"
          : difficulty === 3
          ? alienMode
            ? "Invasión"
            : "Aventura"
          : difficulty === 4
          ? alienMode
            ? "Dominio total del mundo!"
            : "Profesional"
          : alienMode
          ? "Destrucción absoluta"
          : "Competitiva"}
      </span>
      <span>
        Duración: {duration} {duration === 1 ? "día" : "días"}
      </span>
      <span>Temporada: {season}</span>
      <span className={`${activityStyle.countriesSpan}`}>{countries.text}</span>
      <p className={`${activityStyle.countriesContainer}`}>{countries.added}</p>
    </div>
  );
}
