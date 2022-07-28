/* eslint-disable react-hooks/exhaustive-deps */
//////////////////////////////////////////////////////////////////////////////////
// Imports
//////////////////////////////////////////////////////////////////////////////////
// Packages
import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

// Application files
import { alphabeticOrder } from "../../controllers";
import { CreatedActivities } from "./CreatedActivities";
import { SearchCountry } from "../SearchCountry";
import { Form } from "./Form";
import {
  getCountries,
  createActivity,
  setAllActivitiesTypes,
  setCountriesId,
} from "../../redux/actions";

//////////////////////////////////////////////////////////////////////////////////
// Code
//////////////////////////////////////////////////////////////////////////////////
// Component: create/associate activities with countries
export function Activities() {
  const dispatch = useDispatch();

  ////////////////////////////////////////////////////////////////////////////////
  // Data manipulation
  const allCountries = useSelector((state) => state.allCountries);
  const selectedCountries = useSelector((state) => state.selectedCountries);
  const nameSelection = useSelector((state) => state.nameSelection);

  const countryOptions = useMemo(() => {
    // Get countries from db if not in store
    if (!allCountries.length) dispatch(getCountries());

    // Change rendered countries when name has been selected from SearchCountry.js
    return nameSelection === ""
      ? alphabeticOrder([...allCountries], "asc", "name")
      : alphabeticOrder([...selectedCountries], "asc", "name");
  }, [allCountries, selectedCountries]);

  ////////////////////////////////////////////////////////////////////////////////
  // Check existing activities and store added ones
  const allActivitiesTypes = useSelector((state) => state.allActivitiesTypes);
  const createdActivity = useSelector((state) => state.createdActivity);
  const existingActivities = useMemo(() => {
    let activities = [...allActivitiesTypes];

    // If no activity types are stored, check in allCountries
    if (!activities.length) {
      allCountries.forEach((c) => {
        c.Activities?.forEach((a) => {
          if (!activities.includes(a.name)) activities.push(a.name);
        });
      });
    }

    // Only if new activity name is created, store it
    if (
      createdActivity.activity &&
      !activities.includes(createdActivity.activity.name)
    )
      activities.push(createdActivity.activity.name);

    return alphabeticOrder(activities, "asc");
  }, [allCountries, createdActivity]);

  // Update stored activity types
  useEffect(() => {
    dispatch(setAllActivitiesTypes(existingActivities));
  }, [existingActivities]);

  ////////////////////////////////////////////////////////////////////////////////
  // Set "Select all" button text
  const countriesId = useSelector((state) => state.countriesId);

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

  ////////////////////////////////////////////////////////////////////////////////
  // HANDLERS
  // Single country picked
  function handleNewCountryActivity(etarget) {
    const checkbox = etarget;
    let cId = [...countriesId];
    if (checkbox.checked) cId = [...cId, checkbox.parentElement.id];
    else cId = cId.filter((c) => c !== checkbox.parentElement.id);

    dispatch(setCountriesId(cId));
  }

  // Check box when click on label
  function handleLabelClick(id) {
    document.getElementById(id).firstChild.checked =
      !document.getElementById(id).firstChild.checked;
    handleNewCountryActivity(document.getElementById(id).firstChild);
  }

  // Check/Uncheck all rendered countries boxes
  function handleCheckAll(e) {
    e.preventDefault();

    // Check or uncheck all depending on Button value
    const boolean = selectAll === "Seleccionar todo" ? true : false;
    let cId = [...countriesId];
    countryOptions.forEach((c) => {
      document.getElementById(c.id).firstChild.checked = boolean;

      // Add or remove country id to new activity settings
      cId = boolean
        ? !cId.find((pc) => pc === c.id)
          ? [...cId, c.id]
          : cId
        : cId.filter((p) => p !== c.id);

      dispatch(setCountriesId(cId));
    });
  }

  // When changing rendering, keep checked countries
  useEffect(() => {
    allCountries.forEach((c) => {
      if (
        document.getElementById(c.id) &&
        countriesId.some((id) => id === c.id)
      )
        document.getElementById(c.id).firstChild.checked = true;
    });
  }, [countryOptions]);

  ////////////////////////////////////////////////////////////////////////////////
  // CREATED ACTIVITY COMPONENT settings
  const createdActivityComponent = useMemo(() => {
    // If new activity is set
    if (createdActivity.activity) {
      // Get locally stored countries associated
      const localCountriesId = JSON.parse(localStorage.getItem("countriesId"));

      // Text settings
      const creationEffect = createActivity.created
        ? "Creada y añadida"
        : "Añadida";

      const join = localCountriesId.length > 1 ? "a los países" : "al país";

      const addedCountries = localCountriesId.reduce((str, localCountry, i) => {
        return (
          str +
          allCountries.find((c) => c.id === localCountry)?.name +
          (i === localCountriesId.length - 1 ? "" : ", ")
        );
      }, "");

      // Return data
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

  ////////////////////////////////////////////////////////////////////////////////
  // Render
  ////////////////////////////////////////////////////////////////////////////////
  return (
    <div>
      {/* Render existing activities if any */}
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

      {/* Activity creation form */}
      <Form countriesId={countriesId} />

      {/* Countries searching */}
      <SearchCountry />

      {/* Select all actual countries for activity association */}
      <button onClick={handleCheckAll} disabled={!countryOptions.length}>
        {selectAll}
      </button>

      {/* Pop-up component after new activity is set */}
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

      {/* Display checkboxes for countries to choose */}
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
                    onChange={(e) => handleNewCountryActivity(e.target)}
                  />
                  <label onClick={() => handleLabelClick(c.id)}>{c.name}</label>
                </div>
              );
            })}
      </div>
    </div>
  );
}
