/* eslint-disable react-hooks/exhaustive-deps */
// Import packages
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
import { useMemo } from "react";

// CSS
import navbarMain from "../../styles/components/NavBar/NavBar.module.css";
import navbarInvaded from "../../styles/components/NavBar/NavBarI.module.css";

import mainLogo from "../../styles/images/mainLogo.png";
import invadedLogo from "../../styles/images/invadedLogo.png";
import completedLogo from "../../styles/images/completedLogo.png";

import { setAlienMode } from "../../redux/actions";

//////////////////////////////////////////////////////////////
// Code
//////////////////////////////////////////////////////////////
// Component: website navigation
export function NavBar() {
  const dispatch = useDispatch();
  // Get page from store to allow going back to the same point
  const page = useSelector((state) => state.page);

  // Alien
  const alienMode = useSelector((state) => state.alienMode);
  const storedMode =
    localStorage.getItem("alienMode") === "true" ? true : false;
  dispatch(setAlienMode(storedMode));

  const completed = localStorage.getItem("completedInvasion");

  let logo = useMemo(() => {
    return alienMode ? (completed ? completedLogo : invadedLogo) : mainLogo;
  }, [alienMode]);
  let navbar = useMemo(() => {
    return alienMode ? navbarInvaded : navbarMain;
  }, [alienMode]);
  let text = useMemo(() => {
    return alienMode ? "Invasión" : "Turismo";
  }, [alienMode]);

  // Render
  return (
    <div className={`${navbar.container}`}>
      <div className={`${navbar.barContainer}`}>
        <div className={`${navbar.bar}`}>
          <Link to="/" className={`${navbar.logo}`}>
            <img src={logo} className={`${navbar.logoImg}`} alt="logo" />
          </Link>
          <div className={`${navbar.barOptions}`}>
            <NavLink
              to={`/home?page=${page}`}
              style={{ textDecoration: "none" }}
              className={({ isActive }) =>
                isActive ? `${navbar.navLinkActive}` : undefined
              }
            >
              Países
            </NavLink>
            <NavLink
              to="/activities"
              style={{ textDecoration: "none" }}
              className={({ isActive }) =>
                isActive ? `${navbar.navLinkActive}` : undefined
              }
            >
              {text}
            </NavLink>
            <NavLink
              to="/extra"
              style={{ textDecoration: "none" }}
              className={({ isActive }) =>
                isActive ? `${navbar.navLinkActive}` : `${navbar.navExtra}`
              }
            >
              ?
            </NavLink>
          </div>
        </div>
      </div>

      {/*Outlet: required component when nesting Routes*/}
      <Outlet />
    </div>
  );
}
