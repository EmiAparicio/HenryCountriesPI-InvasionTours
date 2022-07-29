/* eslint-disable react-hooks/exhaustive-deps */
////////////////////////////////////////////////////////////////////////////
// Imports
////////////////////////////////////////////////////////////////////////////
// Packages
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

// Application files
import { createActivity } from "../../redux/actions";

// CSS
import activityMain from "../../styles/components/Activities/CreatedActivities.module.css";

const activityStyle = activityMain; // activityMain invadedActivity

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
      <span>Actividad: {name}</span>
      <span>
        {" "}
        Dificultad:{" "}
        {difficulty === 1
          ? "Visita"
          : difficulty === 2
          ? "Esparcimiento"
          : difficulty === 3
          ? "Aventura"
          : difficulty === 4
          ? "Profesional"
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
