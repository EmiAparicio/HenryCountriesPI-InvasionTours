///////////////////////////////////////////////////////////////////
// Code
///////////////////////////////////////////////////////////////////
// Component: shows activity details
export function Activity({ name, difficulty, duration, season }) {
  return (
    <div>
      <span>Actividad: {name}</span>
      <span>Dificultad: {difficulty}</span>
      <span>Duración: {duration}</span>
      <span>Temporada: {season}</span>
    </div>
  );
}
