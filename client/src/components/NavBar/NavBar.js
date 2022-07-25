// Import packages
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";

//////////////////////////////////////////////////////////////
// Code
//////////////////////////////////////////////////////////////
// Component: website navigation
export function NavBar() {
  // Get page from store to allow going back to the same point
  const page = useSelector((state) => state.page);

  // Render
  return (
    <>
      <Link to="/">
        <img src="" alt="logo" />
      </Link>
      <NavLink to={`/home?page=${page}`}>Países</NavLink>
      <NavLink to="/activities">Crear actividad</NavLink>
      <NavLink to="/about">Info</NavLink>

      {/*Outlet: required component when nesting Routes*/}
      <Outlet />
    </>
  );
}
