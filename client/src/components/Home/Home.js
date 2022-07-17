import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getCountries } from "../../redux/actions";
import { Country } from "./Country";

////////////////////////////////////////////////////////////////////////////////

export function Home() {
  const allCountries = useSelector((state) => state.allCountries);
  const selectedCountries = useSelector((state) => state.selectedCountries);
  const dispatch = useDispatch();

  const [selectCountry, setSelectCountry] = useState("");
  const [renderCountries, setRender] = useState([]);
  const [page, setPage] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!allCountries.length) dispatch(getCountries());
  }, [dispatch]);

  useEffect(() => {
    setRender(shuffle(allCountries));
  }, [allCountries]);

  useEffect(() => {
    dispatch(getCountries(selectCountry));
  }, [selectCountry, dispatch]);

  useEffect(() => {
    setRender(selectCountry === "" ? shuffle(allCountries) : selectedCountries);
  }, [selectedCountries, dispatch]);

  function validate(input) {
    let errors = {};
    if (!/^[a-zA-Z\s]+$/.test(input) && input.length)
      errors.input = "Ingresar solo letras";
    return errors;
  }

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  function handleInputChange(e) {
    const input = e.target.value;

    setSelectCountry((prev) => {
      const newState =
        !/^[a-zA-Z\s]+$/.test(input) && input !== "" ? prev : input;
      setErrors(validate(input));
      return newState;
    });
  }

  function handlePage(e) {
    const page = Number(e.target.innerText) - 1;

    setPage(page);
  }

  return (
    <>
      <input
        type="text"
        placeholder="Buscar país"
        onChange={handleInputChange}
      />
      {errors.input && <p>{errors.input}</p>}
      <div>
        {Array.from(
          Array(Math.ceil((renderCountries.length + 1) / 10) + 1).keys()
        ).map((page, id) => {
          if (id > 0)
            return (
              <div key={id}>
                <button onClick={handlePage}>{page}</button>
              </div>
            );
          return <></>;
        })}
      </div>
      <div>
        {renderCountries.map((country, id) => {
          if (
            id >= (page === 0 ? 0 : page * 10 - 1) &&
            id <= (page === 0 ? 8 : page * 10 + 8)
          )
            return (
              <div key={id}>
                <Country
                  name={country.name}
                  continent={country.continent}
                  flag={country.flag}
                />
              </div>
            );
          return <></>;
        })}
      </div>
      <button></button>
      <button></button>
      <button></button>
    </>
  );
}
