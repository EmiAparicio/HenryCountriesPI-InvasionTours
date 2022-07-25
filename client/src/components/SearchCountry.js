///////////////////////////////////////////////////////////////////////////////
// Imports
///////////////////////////////////////////////////////////////////////////////
// Packages
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Application files
import { validateLetters } from "../controllers";
import {
  getCountries,
  setClearSearch,
  setNameSelection,
  setStoredPage,
} from "../redux/actions";

///////////////////////////////////////////////////////////////////////////////
// Code
///////////////////////////////////////////////////////////////////////////////
// Component: search input for filtering countries by name
export function SearchCountry() {
  const dispatch = useDispatch();

  const nameSelection = useSelector((state) => state.nameSelection);
  const [selectCountry, setSelectCountry] = useState(nameSelection);

  // Set store state: selected countries and
  // selected name for options rendering in other components
  useEffect(() => {
    dispatch(getCountries(selectCountry));
    dispatch(setNameSelection(selectCountry));
  }, [selectCountry, dispatch]);

  // Clear search input when store state commands
  const clearSearch = useSelector((state) => state.clearSearch);
  useEffect(() => {
    if (clearSearch) {
      setSelectCountry("");
      dispatch(setClearSearch(false));
    }
  }, [clearSearch, dispatch]);

  // Set selection or errors
  const [errors, setErrors] = useState({});

  function handleInputChange(e) {
    const input = e.target.value;

    setSelectCountry((prev) => {
      const newSelect =
        !/^[a-zA-Z\s]+$/.test(input) && input !== "" ? prev : input;

      setErrors(validateLetters(input));
      return newSelect;
    });

    if (!/^[a-zA-Z\s]+$/.test(input) && input !== "")
      dispatch(setStoredPage(1));
  }

  /////////////////////////////////////////////////////////////////////////////
  // Render
  /////////////////////////////////////////////////////////////////////////////
  return (
    <div>
      <input
        autoComplete="off"
        type="search"
        placeholder="Buscar país"
        onChange={handleInputChange}
        value={selectCountry}
        onBlur={() => setErrors(() => ({ err: "" }))}
      />
      {errors.err && <p>{errors.err}</p>}
    </div>
  );
}
