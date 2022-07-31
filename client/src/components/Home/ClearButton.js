/////////////////////////////////////////////////////////////////////////////
// Imports
/////////////////////////////////////////////////////////////////////////////
// Packages
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

// Application files
import {
  setAlienMode,
  setClearSearch,
  setFilterOptions,
  setOrderOptions,
  setStoredPage,
} from "../../redux/actions";

// CSS
import clearButtonMain from "../../styles/components/Home/ClearButton.module.css";
import invadedClearButton from "../../styles/components/Home/ClearButtonI.module.css";

/////////////////////////////////////////////////////////////////////////////
// Code
/////////////////////////////////////////////////////////////////////////////
// Component: clear all filters AND/OR order configurations depending on type
export function ClearButton({ type, disabled, text }) {
  const dispatch = useDispatch();

  // Alien
  const alienMode = useSelector((state) => state.alienMode);
  const storedMode =
    localStorage.getItem("alienMode") === "true" ? true : false;
  dispatch(setAlienMode(storedMode));

  let clearButton = useMemo(() => {
    return alienMode ? invadedClearButton : clearButtonMain;
  }, [alienMode]);

  // Clear selected configuration type input
  function handleClick() {
    if (type !== "order")
      dispatch(setFilterOptions({ continent: "", activity: "" }));
    if (type !== "filter") dispatch(setOrderOptions([]));
    if (type === "all") {
      dispatch(setClearSearch(true));
    }

    // Reset page after clear
    dispatch(setStoredPage(1));
  }

  // Render
  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className={
        disabled ? `${clearButton.buttonHidden}` : `${clearButton.button}`
      }
    >
      {text}
    </button>
  );
}
