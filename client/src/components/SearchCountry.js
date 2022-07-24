/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { validateLetters } from "../controllers";
import {
  getCountries,
  setNameSelection,
  setStoredPage,
} from "../redux/actions";

export function SearchCountry() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const nameSelection = useSelector((state) => state.nameSelection);
  const [selectCountry, setSelectCountry] = useState(nameSelection);

  useEffect(() => {
    dispatch(getCountries(selectCountry));
    dispatch(setNameSelection(selectCountry));
  }, [selectCountry, dispatch]);

  function handleInputChange(e) {
    dispatch(setStoredPage(1));
    navigate("/home?page=1", { replace: true });

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
