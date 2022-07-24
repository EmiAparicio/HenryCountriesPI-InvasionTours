import React from "react";
import { useDispatch } from "react-redux";
import { shuffle } from "../controllers";
import { shuffleCountries } from "../redux/actions";

export function Shuffler({ countries }) {
  const dispatch = useDispatch();

  function handleClick() {
    dispatch(shuffleCountries(shuffle(countries)));
  }

  return (
    <>
      <button onClick={handleClick}>Mezclar países</button>
    </>
  );
}
