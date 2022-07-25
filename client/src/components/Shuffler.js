/////////////////////////////////////////////////////////////////////
// Imports
/////////////////////////////////////////////////////////////////////
// Packages
import { useDispatch } from "react-redux";

// Application files
import { shuffle } from "../controllers";
import { modifyCountries } from "../redux/actions";

/////////////////////////////////////////////////////////////////////
// Code
/////////////////////////////////////////////////////////////////////
// Component: shuffles "allCountries" in the store state when clicked
export function Shuffler({ countries }) {
  const dispatch = useDispatch();

  function handleClick() {
    dispatch(modifyCountries(shuffle(countries)));
  }

  return (
    <>
      <button onClick={handleClick}>Mezclar países</button>
    </>
  );
}
