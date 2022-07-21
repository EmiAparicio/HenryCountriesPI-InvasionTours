import { useDispatch } from "react-redux";

import { createActivity } from "../../redux/actions";

export function CreatedActivities({
  name,
  difficulty,
  duration,
  season,
  countries,
}) {
  const dispatch = useDispatch();

  return (
    <div>
      <button
        onClick={() => {
          // localStorage.removeItem("createdComponentActive");
          dispatch(createActivity());
        }}
      >
        X
      </button>
      <span>Actividad: {name}</span>
      <span>Dificultad: {difficulty}</span>
      <span>Duración: {duration}</span>
      <span>Temporada: {season}</span>
      <p>{countries}</p>
    </div>
  );
}
