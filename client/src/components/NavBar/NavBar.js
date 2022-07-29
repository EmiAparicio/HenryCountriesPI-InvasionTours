// Import packages
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";

// CSS
import navbarMain from "../../styles/components/NavBar/NavBar.module.css";
import navbarInvaded from "../../styles/components/NavBar/NavBarTest.module.css";
import mainLogo from "../../styles/images/mainLogo.png";
import invadedLogo from "../../styles/images/invadedLogo.png";
import invadedTest from "../../styles/images/invadedTest.png";

const logo = mainLogo; //mainLogo invadedLogo invadedTest
const navbar = navbarMain; //navbarInvaded navbarMain

//////////////////////////////////////////////////////////////
// Code
//////////////////////////////////////////////////////////////
// Component: website navigation
export function NavBar() {
  // Get page from store to allow going back to the same point
  const page = useSelector((state) => state.page);


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
              Turismo
            </NavLink>
            <NavLink
              to="/about"
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
