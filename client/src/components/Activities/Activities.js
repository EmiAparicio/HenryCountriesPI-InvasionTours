/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  getCountries,
  setNameSelection,
  setOrderOptions,
  setFilterOptions,
  createActivity,
  setAllActivitiesTypes,
} from "../../redux/actions";

import { alphabeticOrder, validateLetters } from "../../controllers";

import { CreatedActivities } from "./CreatedActivities";

////////////////////////////////////////////////////////////////////////////////

export function Activities() {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({
    country: {},
    activity: {},
    difficulty: {},
    duration: {},
  });
  const [selectCountry, setSelectCountry] = useState("");
  const [selectActivity, setSelectActivity] = useState("");
  const [selectDifficulty, setSelectDifficulty] = useState(1);
  const [selectDuration, setSelectDuration] = useState(1);
  const [selectSeason, setSelectSeason] = useState("Verano");
  const [countriesId, setCountriesId] = useState([]);

  const allCountries = alphabeticOrder(
    useSelector((state) => state.allCountries),
    "asc",
    "name"
  );
  const selectedCountries = alphabeticOrder(
    useSelector((state) => state.selectedCountries),
    "asc",
    "name"
  );
  const createdActivity = useSelector((state) => state.createdActivity);
  const allActivitiesTypes = useSelector((state) => state.allActivitiesTypes);

  let countryOptions = useMemo(() => {
    if (!allCountries.length) dispatch(getCountries());

    return selectCountry === "" ? allCountries : selectedCountries;
  }, [allCountries, selectedCountries]);

  useEffect(() => {
    dispatch(setOrderOptions([]));
    dispatch(
      setFilterOptions({
        continent: "",
        activity: "",
      })
    );
    dispatch(setNameSelection());

    return () => {};
  }, []);

  useEffect(() => {
    dispatch(getCountries(selectCountry));
  }, [selectCountry, dispatch]);

  let [dummyAct, setDummyAct] = useState(allActivitiesTypes);
  const existingActivities = useMemo(() => {
    let activities = [...dummyAct];

    if (!dummyAct.length) {
      allCountries.forEach((c) => {
        c.Activities?.forEach((a) => {
          if (!activities.includes(a.name)) activities.push(a.name);
        });
      });
    }

    if (
      createdActivity.activity &&
      !activities.includes(createdActivity.activity.name)
    )
      activities.push(createdActivity.activity.name);

    setDummyAct(() => alphabeticOrder(activities, "asc"));
    return alphabeticOrder(activities, "asc");
  }, [allCountries, createdActivity]);

  useEffect(() => {
    dispatch(setAllActivitiesTypes(existingActivities));
  }, [existingActivities]);

  function handleCountryChange(e) {
    const input = e.target.value;

    setSelectCountry((prev) => {
      const newState =
        !/^[a-zA-Z\s]+$/.test(input) && input !== "" ? prev : input;

      setErrors((prev) => ({ ...prev, country: validateLetters(input) }));
      return newState;
    });
  }

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

    setSelectSeason(season);
  }

  function handleCheckAll(e) {
    e.preventDefault();

    const boolean = selectAll === "Seleccionar todo" ? true : false;

    countryOptions.forEach((c) => {
      // Check or uncheck all depending on 'boolean'
      document.getElementById(c.id).firstChild.checked = boolean;

      // Add or remove country id to activity
      boolean
        ? setCountriesId((prev) => [...prev, c.id])
        : setCountriesId((prev) => prev.filter((p) => p !== c.id));
    });
  }

  function handleNewCountryActivity(e) {
    const checkbox = e.target;

    if (checkbox.checked)
      setCountriesId((prev) => [...prev, checkbox.parentElement.id]);
    else
      setCountriesId((prev) =>
        prev.filter((c) => c !== checkbox.parentElement.id)
      );
  }

  // Set "Select all" button value
  const selectAll = useMemo(() => {
    return !countryOptions.length
      ? "Seleccionar todo"
      : // See if all displayed options are checked
      countryOptions.reduce((acc, c) => {
          if (document.getElementById(c.id)) {
            return (
              acc + Number(document.getElementById(c.id).firstChild.checked)
            );
          }
          return acc;
        }, 0) === countryOptions.length
      ? "Deseleccionar todo"
      : "Seleccionar todo";
  }, [countriesId, countryOptions]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit(e) {
    e.preventDefault();

    const activity = {
      name: selectActivity,
      difficulty: selectDifficulty,
      duration: selectDuration,
      season: selectSeason,
      countriesId,
    };

    dispatch(createActivity(activity));
    setSelectActivity("");
    setSelectDifficulty(1);
    setSelectDuration(1);
    setSelectSeason("Verano");
    setSelectCountry("");
    localStorage.setItem("countriesId", JSON.stringify(countriesId));
    setCountriesId([]);

    allCountries.forEach((c) => {
      if (document.getElementById(c.id))
        document.getElementById(c.id).firstChild.checked = false;
    });
  }

  const createdComponent = useMemo(() => {
    if (createdActivity.activity) {
      const creationEffect = createActivity.created
        ? "Creada y añadida"
        : "Añadida";
      const localCountriesId = JSON.parse(localStorage.getItem("countriesId"));

      const addedCountries = localCountriesId.reduce((str, localCountry, i) => {
        return (
          str +
          allCountries.find((c) => c.id === localCountry)?.name +
          (i === localCountriesId.length - 1 ? "" : ", ")
        );
      }, "");

      const join = localCountriesId.length > 1 ? "a los países" : "al país";

      return {
        active: true,
        name: createdActivity.activity?.name,
        difficulty: createdActivity.activity?.difficulty,
        duration: createdActivity.activity?.duration,
        season: createdActivity.activity?.season,
        countries: `${creationEffect} ${join}: ${addedCountries}`,
      };
    } else return { active: false };
  }, [createdActivity]);

  useEffect(() => {
    allCountries.forEach((c) => {
      if (
        document.getElementById(c.id) &&
        countriesId.some((id) => id === c.id)
      )
        document.getElementById(c.id).firstChild.checked = true;
    });
  }, [countryOptions]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {existingActivities.length ? (
        <div>
          <span>Actividades existentes:</span>
          {existingActivities.map((a, id) => {
            return <div key={id}>{a}</div>;
          })}
        </div>
      ) : (
        <></>
      )}

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
        <input
          type="number"
          name="difficulty"
          placeholder="1-5"
          autoComplete="off"
          onChange={handleDifficultyChange}
          onBlur={handleBlur}
          value={selectDifficulty}
        />
        {errors.difficulty.err && <p>{errors.difficulty.err}</p>}

        <label htmlFor="duration">Duración (días): </label>
        <input
          type="number"
          name="duration"
          placeholder="1-30"
          autoComplete="off"
          onChange={handleDurationChange}
          onBlur={handleBlur}
          value={selectDuration}
        />
        {errors.duration.err && <p>{errors.duration.err}</p>}

        <label htmlFor="season">Temporada: </label>
        <select name="season" onChange={handleSeasonChange}>
          <option value="Verano">Verano</option>
          <option value="Otoño">Otoño</option>
          <option value="Invierno">Invierno</option>
          <option value="Primavera">Primavera</option>
        </select>

        <input
          type="search"
          name="country"
          placeholder="Buscar país"
          onChange={handleCountryChange}
          onBlur={handleBlur}
          value={selectCountry}
          autoComplete="off"
        />
        {errors.country.err && <p>{errors.country.err}</p>}

        <button onClick={handleCheckAll} disabled={!countryOptions.length}>
          {selectAll}
        </button>

        <input
          type="submit"
          disabled={!countriesId.length || !selectActivity.length}
          value="Añadir actividad"
        />

        <div>
          <span>Países: </span>
          {!countryOptions.length
            ? "No hay opciones"
            : countryOptions.map((c) => {
                return (
                  <div key={c.id} id={c.id}>
                    <input
                      type="checkbox"
                      value={c.name}
                      name={c.name}
                      onChange={handleNewCountryActivity}
                    />
                    <label htmlFor={c.name}>{c.name}</label>
                  </div>
                );
              })}
        </div>
      </form>

      {createdComponent.active ? (
        <CreatedActivities
          name={createdComponent.name}
          difficulty={createdComponent.difficulty}
          duration={createdComponent.duration}
          season={createdComponent.season}
          countries={createdComponent.countries}
        />
      ) : (
        <></>
      )}
    </>
  );
}
