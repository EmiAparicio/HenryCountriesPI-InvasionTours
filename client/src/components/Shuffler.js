/////////////////////////////////////////////////////////////////////
// Imports
/////////////////////////////////////////////////////////////////////
// Packages
import { useDispatch } from "react-redux";

// Application files
import { shuffle } from "../controllers";
import { modifyCountries } from "../redux/actions";

// CSS
import shufflerMain from "../styles/components/Shuffler.module.css";

const shuffler = shufflerMain; // shufflerMain invadeMain

/////////////////////////////////////////////////////////////////////
// Code
/////////////////////////////////////////////////////////////////////
// Component: shuffles "allCountries" in the store state when clicked
export function Shuffler({ countries, shufflerHidder }) {
  const dispatch = useDispatch();

  function handleClick() {
    dispatch(modifyCountries(shuffle(countries)));
  }

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
