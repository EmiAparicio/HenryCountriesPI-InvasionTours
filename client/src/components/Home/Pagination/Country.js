import { Link } from "react-router-dom";

export function Country({ name, continent, flag, id }) {
  return (
    <div>
      <span>Nombre: {name}</span>
      <Link to={`/country/${id}`}>
        <img src={flag} alt="country flag" />
      </Link>
      <span>Continente: {continent}</span>
    </div>
  );
}