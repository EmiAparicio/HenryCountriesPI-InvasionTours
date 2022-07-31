/////////////////////////////////////////////////////////////////////
// Imports
/////////////////////////////////////////////////////////////////////
// Packages
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

// Application files
import { shuffle } from "../controllers";
import { modifyCountries, setAlienMode } from "../redux/actions";

// CSS
import shufflerMain from "../styles/components/Shuffler.module.css";
import invadedshuffler from "../styles/components/ShufflerI.module.css";

/////////////////////////////////////////////////////////////////////
// Code
/////////////////////////////////////////////////////////////////////
// Component: shuffles "allCountries" in the store state when clicked
export function Shuffler({ countries, shufflerHidder }) {
  const dispatch = useDispatch();

  // Alien
  const alienMode = useSelector((state) => state.alienMode);
  const storedMode =
    localStorage.getItem("alienMode") === "true" ? true : false;
  dispatch(setAlienMode(storedMode));

  let shuffler = useMemo(() => {
    return alienMode ? invadedshuffler : shufflerMain;
  }, [alienMode]);

  // Handler
  function handleClick() {
    dispatch(modifyCountries(shuffle(countries)));
  }

  // Render
  return (
    <div className={`${shuffler.container}`}>
      <button
        onClick={handleClick}
        className={
          shufflerHidder ? `${shuffler.shuffler}` : `${shuffler.shufflerHide}`
        }
      >
        Mezclar países
      </button>
    </div>
  );
}
