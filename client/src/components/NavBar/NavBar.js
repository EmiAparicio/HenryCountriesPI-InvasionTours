import { Outlet } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";

export function NavBar() {
  return (
    <>
      <Link to="/">
        <img src="" alt="logo" />
      </Link>
      <NavLink to="/home">Países</NavLink>
      <NavLink to="/activities">Crear actividad</NavLink>
      <NavLink to="/about">Info</NavLink>

      <Outlet />
    </>
  );
}
