///////////////////////////////////////////////////////////////////
// Code
///////////////////////////////////////////////////////////////////

import { useDispatch, useSelector } from "react-redux";
import { setAlienMode } from "../../redux/actions";

// Component: shows activity details
export function Activity({ name, difficulty, duration, season }) {
  
  // Alien
    const dispatch = useDispatch();

  const alienMode = useSelector((state) => state.alienMode);
  const storedMode =
    localStorage.getItem("alienMode") === "true" ? true : false;
  dispatch(setAlienMode(storedMode));
  return (
    <div>
      <span>{alienMode ? "Ejecuciones":"Actividad"}: {name}</span>
      <span>
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
    </div>
  );
}
