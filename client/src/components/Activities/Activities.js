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
  setCountriesId,
  setAlienMode,
  getInvadedCountries,
} from "../../redux/actions";

// CSS
import { LetRender } from "../LetRender";
import activitiesMain from "../../styles/components/Activities/Activities.module.css";
import invadedActivities from "../../styles/components/Activities/ActivitiesI.module.css";
import { useNavigate } from "react-router-dom";

//////////////////////////////////////////////////////////////////////////////////
// Code
//////////////////////////////////////////////////////////////////////////////////
// Component: create/associate activities with countries
export function Activities() {
  const dispatch = useDispatch();
  ////////////////////////////////////////////////////////////////////////////////
  // Alien
  const alienMode = useSelector((state) => state.alienMode);
  const storedMode =
    localStorage.getItem("alienMode") === "true" ? true : false;
  dispatch(setAlienMode(storedMode));

  let activitiesStyle = useMemo(() => {
    return alienMode ? invadedActivities : activitiesMain;
  }, [alienMode]);

  // Invasion
  const allCountries = useSelector((state) => state.allCountries);

  // Get random 3 countries
  const invasionArray = useMemo(() => {
    const storedInvaded = JSON.parse(localStorage.getItem("invadedCountries"));

    if (storedInvaded?.length) {
      return storedInvaded;
    } else if (allCountries.length) {
      const randomCountries = [...allCountries]
        .filter((c) => {
          return (
            c.name !== "Macau" &&
            c.name !== "Bouvet Island" &&
            c.name !== "Antarctica"
          );
        })
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((r) => r.id);

      dispatch(getInvadedCountries(randomCountries));

      return randomCountries;
    }
  }, [allCountries]);

  function handleKeyboard(e) {
    if (e.repeat) return;

    if ((e.metaKey || e.ctrlKey) && e.key === "c") {
      e.preventDefault();
      if (
        localStorage.getItem("alienMode") === "true" &&
        !localStorage.getItem("completedInvasion")
      ) {
        localStorage.setItem("game", true);
        window.alert(
          `Ejecuta invasión "NEILA" en los países de las siguientes capitales:
          ${JSON.parse(localStorage.getItem("invadedCountries")).reduce(
            (list, ele, i) => {
              return (
                list +
                ele.capital +
                (i !==
                JSON.parse(localStorage.getItem("invadedCountries")).length - 1
                  ? ", "
                  : ".")
              );
            },
            ""
          )}`
        );
      }
    } else if ((e.metaKey || e.ctrlKey) && e.key === "v") {
      e.preventDefault();
      dispatch(getInvadedCountries());
      dispatch(getCountries());
      dispatch(createActivity());
      localStorage.removeItem("completedInvasion");
      window.alert("Has regresado en el tiempo, ¡vuelve a intentarlo!");
    } else if ((e.metaKey || e.ctrlKey) && e.key === "m") {
      localStorage.setItem("completedInvasion", true);
      window.alert("¡Invasión completada!");
      navigate("/");
    }
  }

  useEffect(() => {
    if (alienMode) {
      document.addEventListener("keydown", handleKeyboard);

      return () => document.removeEventListener("keydown", handleKeyboard);
    }
  }, []);

  ////////////////////////////////////////////////////////////////////////////////
  // Data manipulation
  // const allCountries: declared above
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
  const existingActivities = useMemo(() => {
    let activities = [];

    // Check for activities/invasions in allCountries
    alienMode
      ? allCountries.forEach((c) => {
          c.Invasions?.forEach((a) => {
            if (!activities.includes(a.name)) activities.push(a.name);
          });
        })
      : allCountries.forEach((c) => {
          c.Activities?.forEach((a) => {
            if (!activities.includes(a.name)) activities.push(a.name);
          });
        });

    return alphabeticOrder(activities, "asc");
  }, [allCountries]);

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
  const createdActivity = useSelector((state) => state.createdActivity);
  const createdActivityComponent = useMemo(() => {
    dispatch(getCountries());
    // If new activity is set
    if (createdActivity.activity || (alienMode && createdActivity.invasion)) {
      // Get locally stored countries associated
      const localCountriesId = JSON.parse(localStorage.getItem("countriesId"));

      // Text settings
      const creationEffect = createActivity.created
        ? alienMode
          ? "Planeada y ejecutada"
          : "Creada y añadida"
        : alienMode
        ? "Ejecutada"
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
        name: alienMode
          ? createdActivity.invasion?.name
          : createdActivity.activity?.name,
        difficulty: alienMode
          ? createdActivity.invasion?.difficulty
          : createdActivity.activity?.difficulty,
        duration: alienMode
          ? createdActivity.invasion?.duration
          : createdActivity.activity?.duration,
        season: alienMode
          ? createdActivity.invasion?.season
          : createdActivity.activity?.season,
        countries: {
          text: `${creationEffect} ${join}: `,
          added: `${addedCountries}`,
        },
      };
    } else return { active: false };
  }, [createdActivity]);

  ////////////////////////////////////////////////////////////////////////////////
  // Alien
  const navigate = useNavigate();

  useEffect(() => {
    // console.log(invasionArray);
    if (
      alienMode &&
      existingActivities.includes("NEILA") &&
      localStorage.getItem("game")
    ) {
      let invadedIds = [];

      const invaded = allCountries.reduce((acc, c) => {
        return (
          acc +
          (c.Invasions.find((i) => {
            if (
              i.name === "NEILA" &&
              i.difficulty === 3 &&
              i.usercode === localStorage.getItem("usercode")
            ) {
              invadedIds.push(c.id);
              return true;
            }
            return false;
          })
            ? 1
            : 0)
        );
      }, 0);

      const completed =
        invaded === 3
          ? invadedIds.reduce((acc, id) => {
              return acc && !!invasionArray.find((i) => id === i.id);
            }, true)
          : false;

      if (completed) {
        localStorage.setItem("completedInvasion", true);
        window.alert("¡Invasión completada!");
        navigate("/");
      }
    }
  }, [createdActivity, allCountries, invasionArray, existingActivities.length]);

  ////////////////////////////////////////////////////////////////////////////////
  // Render
  ////////////////////////////////////////////////////////////////////////////////
  return (
    <div>
      <LetRender />
      {/* Activity creation form */}
      <Form existingActivities={existingActivities} />

      <div className={`${activitiesStyle.container}`}>
        {/* Countries searching */}
        <div className={`${activitiesStyle.searchContainer}`}>
          <SearchCountry style={{ width: "300px" }} />
        </div>

        {/* Select all actual countries for activity association */}
        <div className={`${activitiesStyle.buttonContainer}`}>
          <button
            onClick={handleCheckAll}
            disabled={!countryOptions.length}
            className={
              !countryOptions.length
                ? `${activitiesStyle.buttonHidden}`
                : `${activitiesStyle.button}`
            }
          >
            {selectAll}
          </button>
        </div>

        {/* Display checkboxes for countries to choose */}
        <div className={`${activitiesStyle.countries}`}>
          <span>Países: </span>
          <div className={`${activitiesStyle.countryContainer}`}>
            {!allCountries.length ? (
              <span className={`${activitiesStyle.loading}`}>
                Cargando datos...
              </span>
            ) : !countryOptions.length ? (
              <span>"No hay opciones"</span>
            ) : (
              countryOptions.map((c) => {
                return (
                  <div key={c.id} id={c.id}>
                    <input
                      type="checkbox"
                      value={c.name}
                      name={c.name}
                      onChange={(e) => handleNewCountryActivity(e.target)}
                    />
                    <label onClick={() => handleLabelClick(c.id)}>
                      {c.name}
                    </label>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

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
    </div>
  );
}
