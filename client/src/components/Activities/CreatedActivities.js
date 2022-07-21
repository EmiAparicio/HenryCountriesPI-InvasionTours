import { useDispatch } from "react-redux";
import { useEffect } from "react";

import { createActivity } from "../../redux/actions";

export function CreatedActivities({
  name,
  difficulty,
  duration,
  season,
  countries,
}) {
  const dispatch = useDispatch();

  function handleClose() {
    dispatch(createActivity());
  }

  useEffect(() => {
    return () => handleClose();
  });

  return (
    <div>
      <button onClick={handleClose}>X</button>
      <span>Actividad: {name}</span>
      <span>Dificultad: {difficulty}</span>
      <span>Duración: {duration}</span>
      <span>Temporada: {season}</span>
      <p>{countries}</p>
    </div>
  );
}
