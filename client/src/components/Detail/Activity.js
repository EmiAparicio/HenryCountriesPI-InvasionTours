///////////////////////////////////////////////////////////////////
// Code
///////////////////////////////////////////////////////////////////
// Component: shows activity details
export function Activity({ name, difficulty, duration, season }) {
  return (
    <div>
      <span>Actividad: {name}</span>
      <span>
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
      <span>Duración: {duration} {duration === 1 ? "día" : "días"}</span>
      <span>Temporada: {season}</span>
    </div>
  );
}
