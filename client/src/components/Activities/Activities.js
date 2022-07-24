/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  getCountries,
  setOrderOptions,
  setFilterOptions,
  createActivity,
  setAllActivitiesTypes,
  setStoredPage,
  setCountriesId,
} from "../../redux/actions";

import { alphabeticOrder } from "../../controllers";

import { CreatedActivities } from "./CreatedActivities";
import { SearchCountry } from "../SearchCountry";
import { Form } from "./Form";

////////////////////////////////////////////////////////////////////////////////

export function Activities() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setOrderOptions([]));
    dispatch(
      setFilterOptions({
        continent: "",
        activity: "",
      })
    );
    dispatch(setStoredPage(1));
  }, []);

  const countriesId = useSelector((state) => state.countriesId);
  const allCountries = useSelector((state) => state.allCountries);
  const selectedCountries = useSelector((state) => state.selectedCountries);
  const nameSelection = useSelector((state) => state.nameSelection);
  const createdActivity = useSelector((state) => state.createdActivity);
  const allActivitiesTypes = useSelector((state) => state.allActivitiesTypes);

  const countryOptions = useMemo(() => {
    if (!allCountries.length) dispatch(getCountries());

    return nameSelection === ""
      ? alphabeticOrder([...allCountries], "asc", "name")
      : alphabeticOrder([...selectedCountries], "asc", "name");
  }, [allCountries, selectedCountries]);

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

  function handleCheckAll(e) {
    e.preventDefault();

    const boolean = selectAll === "Seleccionar todo" ? true : false;
    let cId = [...countriesId];
    countryOptions.forEach((c) => {
      // Check or uncheck all depending on 'boolean'
      document.getElementById(c.id).firstChild.checked = boolean;

      // Add or remove country id to activity

      cId = boolean
        ? !cId.find((pc) => pc === c.id)
          ? [...cId, c.id]
          : cId
        : cId.filter((p) => p !== c.id);

      dispatch(setCountriesId(cId));
    });
  }

  function handleNewCountryActivity(e) {
    const checkbox = e.target;
    let cId = [...countriesId];
    if (checkbox.checked) cId = [...cId, checkbox.parentElement.id];
    else cId = cId.filter((c) => c !== checkbox.parentElement.id);

    dispatch(setCountriesId(cId));
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
  }, [countriesId, countryOptions]);

  const createdActivityComponent = useMemo(() => {
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

      <Form countriesId={countriesId} />

      <SearchCountry />

      <button onClick={handleCheckAll} disabled={!countryOptions.length}>
        {selectAll}
      </button>

      {createdActivityComponent.active ? (
        <CreatedActivities
          name={createdActivityComponent.name}
          difficulty={createdActivityComponent.difficulty}
          duration={createdActivityComponent.duration}
          season={createdActivityComponent.season}
          countries={createdActivityComponent.countries}
        />
      ) : (
        <></>
      )}

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
                  <label
                    onClick={() => {
                      document.getElementById(c.id).firstChild.checked =
                        !document.getElementById(c.id).firstChild.checked;
                    }}
                  >
                    {c.name}
                  </label>
                </div>
              );
            })}
      </div>
    </>
  );
}
