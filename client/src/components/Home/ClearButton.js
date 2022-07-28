/////////////////////////////////////////////////////////////////////////////
// Imports
/////////////////////////////////////////////////////////////////////////////
// Packages
import { useDispatch } from "react-redux";

// Application files
import {
  setClearSearch,
  setFilterOptions,
  setOrderOptions,
  setStoredPage,
} from "../../redux/actions";

// CSS

import clearButtonMain from "../../styles/components/Home/ClearButton.module.css"

const clearButton = clearButtonMain; // clearButtonMain

/////////////////////////////////////////////////////////////////////////////
// Code
/////////////////////////////////////////////////////////////////////////////
// Component: clear all filters AND/OR order configurations depending on type
export function ClearButton({ type, disabled, text }) {
  const dispatch = useDispatch();

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
    <button disabled={disabled} onClick={handleClick} className={disabled ? `${clearButton.buttonHidden}` : `${clearButton.button}`}>
      {text}
    </button>
  );
}
