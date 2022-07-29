////////////////////////////////////////////////////////////////////////////////
// Imports
////////////////////////////////////////////////////////////////////////////////
// Packages
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { validateLetters } from "../../controllers";
import { createActivity, setCountriesId } from "../../redux/actions";

// CSS
import formMain from "../../styles/components/Activities/Form.module.css";

const form = formMain; // formMain invadedForm

////////////////////////////////////////////////////////////////////////////////
// Code
////////////////////////////////////////////////////////////////////////////////
// Component: form to be filled in order to create/associate an activity
export function Form({ existingActivities }) {
  const dispatch = useDispatch();

  // Hide error message when losing focus
  const [errors, setErrors] = // Error messages depending on input
    useState({
      activity: {},
      difficulty: {},
      duration: {},
      season: {},
    });

  function handleBlur(e) {
    const element = e.target.name;
    setErrors((prev) => ({
      ...prev,
      [element]: {},
    }));
  }

  //////////////////////////////////////////////////////////////////////////////
  // ACTIVITY NAME selection handler
  const [selectActivity, setSelectActivity] = useState("");

  function handleActivityChange(e) {
    const input = e.target.value;

    // Set new local state if input has no error
    setSelectActivity((prev) => {
      const newState =
        !/^[a-zA-Z\s]+$/.test(input) && input !== "" ? prev : input;

      setErrors((prev) => ({ ...prev, activity: validateLetters(input) }));

      return newState;
    });
  }

  // Clear activity name when click on label
  const activityNameRef = useRef();

  function handleNameClear() {
    setSelectActivity("");
  }

  //////////////////////////////////////////////////////////////////////////////
  // DIFFICULTY selection handler
  const [selectDifficulty, setSelectDifficulty] = useState(1);

  function handleDifficultyChange(e) {
    const input = Number(e.target.value);
    let errors = "";
    let newState;

    // Set new local state if input has no error
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

  //////////////////////////////////////////////////////////////////////////////
  // DURATION selection handler
  const [selectDuration, setSelectDuration] = useState(1);

  function handleDurationChange(e) {
    const input = Number(e.target.value);
    let errors = "";
    let newState;

    // Set new local state if input has no error
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

  //////////////////////////////////////////////////////////////////////////////
  // SEASON selection handler
  const [selectSeason, setSelectSeason] = useState("Verano");

  function handleSeasonChange(e) {
    const season = e.target.value;
    let newState;
    let errors = "";

    // Set new local state if input has no error
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

  //////////////////////////////////////////////////////////////////////////////
  // SUBMIT handler
  const diffRef = useRef(); // Difficulty 1 input reference
  const allCountries = useSelector((state) => state.allCountries);
  const countriesId = // Associated countries from Activities.js
    useSelector((state) => state.countriesId);

  function handleSubmit(e) {
    e.preventDefault();

    // Preparing req.body for POST query
    const activity = {
      name: selectActivity,
      difficulty: selectDifficulty,
      duration: selectDuration,
      season: selectSeason,
      countriesId: [...countriesId],
    };

    dispatch(createActivity());
    dispatch(createActivity(activity));

    // Reset all used data
    setSelectActivity("");
    diffRef.current.checked = true;
    setSelectDuration(1);
    setSelectSeason("Verano");
    // dispatch(setClearSearch(true)); // Clear country search when submit
    dispatch(setCountriesId([]));

    // Uncheck all countries boxes
    allCountries.forEach((c) => {
      if (document.getElementById(c.id))
        document.getElementById(c.id).firstChild.checked = false;
    });

    // Save related countries ID to be used by CreatedActivities.js
    localStorage.setItem("countriesId", JSON.stringify(countriesId));
  }

  //////////////////////////////////////////////////////////////////////////////
  // Render
  //////////////////////////////////////////////////////////////////////////////
  return (
    <div style={{ userSelect: "none" }}>
      <div className={`${form.buttonContainer}`}>
        <input
          type="submit"
          disabled={!countriesId.length || !selectActivity.length}
          value="Añadir actividad"
          className={
            !countriesId.length || !selectActivity.length
              ? `${form.buttonHidden}`
              : `${form.button}`
          }
        />
      </div>
      <div style={{ height: "2vh" }}>
        <div
          className={
            !(!countriesId.length || !selectActivity.length)
              ? `${form.mainTextHidden}`
              : `${form.mainText}`
          }
        >
          Añadir actividad
        </div>
      </div>
      <form onSubmit={handleSubmit} className={`${form.formContainer}`}>
        {/* ---------------------------------------------------------------- */}
        {/* Name */}
        {/* ---------------------------------------------------------------- */}
        <div className={`${form.nameContainer}`}>
          <label
            htmlFor="activity"
            onClick={handleNameClear}
            className={
              !selectActivity.length
                ? `${form.label}`
                : `${form.nameLabelClean}`
            }
          >
            Nombre:{" "}
          </label>
          <input
            list="existingActivities"
            name="activity"
            placeholder='"Actividad"'
            autoComplete="off"
            onChange={handleActivityChange}
            onBlur={handleBlur}
            value={selectActivity}
            className={`${form.name}`}
          />
          <datalist id="existingActivities">
            {existingActivities.map((a, id) => {
              return <option key={id} value={a} />;
            })}
          </datalist>
          {
            <p
              className={
                errors.activity.err ? `${form.error}` : `${form.errorHidden}`
              }
            >
              {errors.activity.err || "No error"}
            </p>
          }
        </div>
        {/* ---------------------------------------------------------------- */}
        {/* Difficulty */}
        {/* ---------------------------------------------------------------- */}
        <div className={`${form.difficultyContainer}`}>
          <label htmlFor="difficulty" className={`${form.label}`}>
            Dificultad:{" "}
          </label>
          <div
            name="difficulty"
            onChange={handleDifficultyChange}
            className={`${form.difficultyLabelsContainer}`}
          >
            <label>
              <input
                ref={diffRef}
                type="radio"
                id="diff1"
                name="difficulty"
                value={1}
                defaultChecked
              />{" "}
              Visita
            </label>
            <label>
              <input type="radio" id="diff2" name="difficulty" value={2} />{" "}
              Esparcimiento
            </label>
            <label>
              <input type="radio" id="diff3" name="difficulty" value={3} />{" "}
              Aventura
            </label>
            <label>
              <input type="radio" id="diff4" name="difficulty" value={4} />{" "}
              Profesional
            </label>
            <label>
              <input type="radio" id="diff5" name="difficulty" value={5} />{" "}
              Competitiva
            </label>
          </div>
          {
            <p
              className={
                errors.difficulty.err ? `${form.error}` : `${form.errorHidden}`
              }
            >
              {errors.difficulty.err || "No error"}
            </p>
          }
        </div>
        {/* ---------------------------------------------------------------- */}
        {/* Duration */}
        {/* ---------------------------------------------------------------- */}
        <div className={`${form.durationContainer}`}>
          <label htmlFor="duration" className={`${form.label}`}>
            Duración:
          </label>
          <label> {document.getElementById("duration")?.value} días</label>
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
            className={`${form.durationRange}`}
          />
          {
            <p
              className={
                errors.duration.err ? `${form.error}` : `${form.errorHidden}`
              }
            >
              {errors.duration.err || "No error"}
            </p>
          }
        </div>
        {/* ---------------------------------------------------------------- */}
        {/* Season */}
        {/* ---------------------------------------------------------------- */}
        <div className={`${form.seasonContainer}`}>
          <label htmlFor="season" className={`${form.label}`}>
            Temporada:{" "}
          </label>
          <select
            name="season"
            onChange={handleSeasonChange}
            onBlur={handleBlur}
            className={`${form.seasonSelect}`}
          >
            <option value="Verano" className={`${form.seasonOption}`}>
              Verano
            </option>
            <option value="Otoño" className={`${form.seasonOption}`}>
              Otoño
            </option>
            <option value="Invierno" className={`${form.seasonOption}`}>
              Invierno
            </option>
            <option value="Primavera" className={`${form.seasonOption}`}>
              Primavera
            </option>
          </select>
          {
            <p
              className={
                errors.season.err ? `${form.error}` : `${form.errorHidden}`
              }
            >
              {errors.season.err || "No error"}
            </p>
          }
        </div>
        {/* ---------------------------------------------------------------- */}
        {/* Submit Button */}
        {/* ---------------------------------------------------------------- */}
      </form>
    </div>
  );
}
