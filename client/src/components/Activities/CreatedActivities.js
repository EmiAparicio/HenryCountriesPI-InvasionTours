/* eslint-disable react-hooks/exhaustive-deps */
////////////////////////////////////////////////////////////////////////////
// Imports
////////////////////////////////////////////////////////////////////////////
// Packages
import { useDispatch } from "react-redux";
import { useEffect } from "react";

// Application files
import { createActivity } from "../../redux/actions";

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

  // Removes related countries from localStorage, added by Form.js
  function handleClose() {
    dispatch(createActivity());
    localStorage.removeItem("countriesId");
  }

  // Automatically closes component after 15 secs
  let closeProcess = null;
  useEffect(() => {
    closeProcess = setInterval(() => handleClose(), 15000);
  }, [closeProcess]);

  // Makes sure localStorage cleaning is getting done when leaving page
  useEffect(() => {
    return () => {
      clearInterval(closeProcess);
      handleClose();
    };
  }, []);

  // Render
  return (
    <div>
      <button onClick={handleClose}>X</button>
      <span>Actividad: {name}</span>
      <span>Dificultad: {difficulty}</span>
      <span>Duración: {duration} días</span>
      <span>Temporada: {season}</span>
      <p>{countries}</p>
    </div>
  );
}
