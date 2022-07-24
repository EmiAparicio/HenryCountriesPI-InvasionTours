import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { validateLetters } from "../../controllers";
import {
  createActivity,
  setClearSearch,
  setCountriesId,
} from "../../redux/actions";

export function Form() {
  const dispatch = useDispatch();

  const diffRef = useRef();

  const allCountries = useSelector((state) => state.allCountries);

  const countriesId = useSelector((state) => state.countriesId);

  const [selectActivity, setSelectActivity] = useState("");
  const [selectDifficulty, setSelectDifficulty] = useState(1);
  const [selectDuration, setSelectDuration] = useState(1);
  const [selectSeason, setSelectSeason] = useState("Verano");
  const [errors, setErrors] = useState({
    activity: {},
    difficulty: {},
    duration: {},
    season: {},
  });
  function handleActivityChange(e) {
    const input = e.target.value;

    setSelectActivity((prev) => {
      const newState =
        !/^[a-zA-Z\s]+$/.test(input) && input !== "" ? prev : input;

      setErrors((prev) => ({ ...prev, activity: validateLetters(input) }));
      return newState;
    });
  }

  function handleBlur(e) {
    const element = e.target.name;
    setErrors((prev) => ({
      ...prev,
      [element]: {},
    }));
  }

  function handleDifficultyChange(e) {
    const input = Number(e.target.value);
    let errors = "";
    let newState;

    setSelectDifficulty((prev) => {
      if (input < 1 || input > 5 || parseInt(input) !== Math.floor(input)) {
        errors = "La dificultad debe estar entre 1 y 5";

        newState = prev;
      } else newState = input;

      setErrors((prev) => ({
        ...prev,
        difficulty: errors.length ? { err: errors } : {},
      }));
      return newState;
    });
  }

  function handleDurationChange(e) {
    const input = Number(e.target.value);
    let errors = "";
    let newState;

    setSelectDuration((prev) => {
      if (input < 1 || input > 30 || parseInt(input) !== Math.floor(input)) {
        errors = "La duración debe estar entre 1 y 30 días";

        newState = prev;
      } else newState = input;

      setErrors((prev) => ({
        ...prev,
        duration: errors.length ? { err: errors } : {},
      }));
      return newState;
    });
  }

  function handleSeasonChange(e) {
    const season = e.target.value;
    let newState;
    let errors = "";

    setSelectSeason((prev) => {
      if (
        season !== "Verano" &&
        season !== "Otoño" &&
        season !== "Primavera" &&
        season !== "Invierno"
      ) {
        errors = "Temporada inválida";

        newState = prev;
      } else newState = season;

      setErrors((prev) => ({
        ...prev,
        season: errors.length ? { err: errors } : {},
      }));
      return newState;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const activity = {
      name: selectActivity,
      difficulty: selectDifficulty,
      duration: selectDuration,
      season: selectSeason,
      countriesId: [...countriesId],
    };

    dispatch(createActivity(activity));
    setSelectActivity("");
    diffRef.current.checked = true;
    setSelectDuration(1);
    setSelectSeason("Verano");
    dispatch(setClearSearch(true));
    localStorage.setItem("countriesId", JSON.stringify(countriesId));
    dispatch(setCountriesId([]));

    allCountries.forEach((c) => {
      if (document.getElementById(c.id))
        document.getElementById(c.id).firstChild.checked = false;
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="activity">Nombre: </label>
        <input
          type="search"
          name="activity"
          placeholder='"Actividad"'
          autoComplete="off"
          onChange={handleActivityChange}
          onBlur={handleBlur}
          value={selectActivity}
        />
        {errors.activity.err && <p>{errors.activity.err}</p>}

        <label htmlFor="difficulty">Dificultad: </label>
        <div name="difficulty" onChange={handleDifficultyChange}>
          <input
            ref={diffRef}
            type="radio"
            id="diff1"
            name="difficulty"
            value={1}
            defaultChecked
          />
          <label>Esparcimiento</label>
          <input type="radio" id="diff2" name="difficulty" value={2} />
          <label>Básica</label>
          <input type="radio" id="diff3" name="difficulty" value={3} />
          <label>Normal</label>
          <input type="radio" id="diff4" name="difficulty" value={4} />
          <label>Profesional</label>
          <input type="radio" id="diff5" name="difficulty" value={5} />
          <label>Competitiva</label>
        </div>
        {errors.difficulty.err && <p>{errors.difficulty.err}</p>}

        <label htmlFor="duration">
          Duración: {document.getElementById("duration")?.value} días{" "}
        </label>
        <input
          type="range"
          name="duration"
          id="duration"
          min={1}
          max={30}
          autoComplete="off"
          onChange={handleDurationChange}
          onBlur={handleBlur}
          value={selectDuration}
        />
        {errors.duration.err && <p>{errors.duration.err}</p>}

        <label htmlFor="season">Temporada: </label>
        <select name="season" onChange={handleSeasonChange} onBlur={handleBlur}>
          <option value="Verano">Verano</option>
          <option value="Otoño">Otoño</option>
          <option value="Invierno">Invierno</option>
          <option value="Primavera">Primavera</option>
        </select>
        {errors.season.err && <p>{errors.season.err}</p>}

        <input
          type="submit"
          disabled={!countriesId.length || !selectActivity.length}
          value="Añadir actividad"
        />
      </form>
    </>
  );
}
