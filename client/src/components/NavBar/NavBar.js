import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";

export function NavBar() {
  const page = useSelector((state) => state.page);

  return (
    <>
      <Link to="/">
        <img src="" alt="logo" />
      </Link>
      <NavLink to={`/home?page=${page}`}>Países</NavLink>
      <NavLink to="/activities">Crear actividad</NavLink>
      <NavLink to="/about">Info</NavLink>

      <Outlet />
    </>
  );
}
