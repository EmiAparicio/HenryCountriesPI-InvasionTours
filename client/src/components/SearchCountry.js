/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { validateLetters } from "../controllers";
import {
  getCountries,
  setClearSearch,
  setNameSelection,
} from "../redux/actions";

export function SearchCountry() {
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});

  const clearSearch = useSelector((state) => state.clearSearch);
  const nameSelection = useSelector((state) => state.nameSelection);
  const [selectCountry, setSelectCountry] = useState(nameSelection);

  useEffect(() => {
    dispatch(getCountries(selectCountry));
    dispatch(setNameSelection(selectCountry));
  }, [selectCountry, dispatch]);

  useEffect(() => {
    if (clearSearch) {
      setSelectCountry("");
      dispatch(setClearSearch(false));
    }
  }, [clearSearch]);

  function handleInputChange(e) {
    const input = e.target.value;

    setSelectCountry((prev) => {
      const newSelect =
        !/^[a-zA-Z\s]+$/.test(input) && input !== "" ? prev : input;

      setErrors(validateLetters(input));
      return newSelect;
    });
  }

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
