/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
////////////////////////////////////////////////////////////////////////////////
// Imports
////////////////////////////////////////////////////////////////////////////////
// Packages
import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

// Application files
import { SearchCountry } from "../SearchCountry";
import { Pagination } from "./Pagination/Pagination";
import { Shuffler } from "../Shuffler";
import { ConfigRender } from "./ConfigRender";
import { alphabeticOrder } from "../../controllers";
import { ClearButton } from "./ClearButton";
import {
  getCountries,
  setAllActivitiesTypes,
  setFilterOptions,
  setOrderOptions,
} from "../../redux/actions";

////////////////////////////////////////////////////////////////////////////////
// Code
////////////////////////////////////////////////////////////////////////////////
// Component: displays and filters/orders countries
export function Home() {
  const dispatch = useDispatch();

  //////////////////////////////////////////////////////////////////////////////
  // Data manipulation
  const allCountries = useSelector((state) => state.allCountries);
  const selectedCountries = useSelector((state) => state.selectedCountries);
  const nameSelection = useSelector((state) => state.nameSelection);

  // Get countries from db if not in store
  useEffect(() => {
    if (!allCountries.length) dispatch(getCountries());
  }, [allCountries]);

  // Change rendered countries when name has been selected from SearchCountry.js
  const renderCountries = useMemo(() => {
    return nameSelection === "" ? [...allCountries] : [...selectedCountries];
  }, [allCountries, selectedCountries]);

  // Obtain configuration settings from store
  const orderConfig = useSelector((state) => state.orderConfig);
  const filterConfig = useSelector((state) => state.filterConfig);

  // Filtered/Ordered array from renderCountries manipulation
  const configuredCountries = useMemo(() => {
    // Apply filters
    const filteredRender = renderCountries.filter(
      (c) =>
        // Filter CONTINENT
        (filterConfig.continent.length
          ? c.continent === filterConfig.continent
          : true) &&
        // Filter ACTIVITY
        (filterConfig.activity.length
          ? c.Activities.reduce((bool, act) => {
              return bool || act.name === filterConfig.activity;
            }, false)
          : true)
    );

    // Apply order
    let configuredRender = filteredRender;

    // Order ALPHABET
    if (orderConfig.length && orderConfig[0] === "alphabet") {
      configuredRender = alphabeticOrder(
        filteredRender,
        orderConfig[1],
        "name"
      );
    }
    // Order POPULATION
    if (orderConfig.length && orderConfig[0] === "population") {
      configuredRender = configuredRender.sort((a, b) => {
        const [A, B] = [a.population, b.population];

        if (orderConfig[1] === "asc") {
          if (A < B) return -1;
          if (A > B) return 1;
        }
        if (orderConfig[1] === "desc") {
          if (A > B) return -1;
          if (A < B) return 1;
        }
        return 0;
      });
    }

    return configuredRender;
  }, [orderConfig, filterConfig, renderCountries]);

  //////////////////////////////////////////////////////////////////////////////
  // Setting filters/order available options
  const allActivitiesTypes = useSelector((state) => state.allActivitiesTypes);

  // Store existing activity names
  useEffect(() => {
    let activities = [...allActivitiesTypes];
    renderCountries.forEach((c) => {
      c.Activities?.forEach((a) => {
        if (!activities.includes(a.name)) activities.push(a.name);
      });
    });
    dispatch(setAllActivitiesTypes(activities));
  }, [renderCountries]);

  // If new activity has been added, retreive data from db again
  useEffect(() => {
    dispatch(getCountries());
  }, [allActivitiesTypes.length]);

  // Set filters options depending on rendered (not filtered) countries
  const filters = useMemo(() => {
    let [continents, activities] = [[], [...allActivitiesTypes]];
    let partialActivities = [];

    // If no countries after filters, no options will be available
    if (configuredCountries.length)
      renderCountries.forEach((c) => {
        // Filter Continent options
        if (!continents.includes(c.continent)) continents.push(c.continent);

        // Filter Activity options
        if (renderCountries.length !== allCountries.length) {
          c.Activities?.forEach((a) => {
            if (!partialActivities.includes(a.name))
              partialActivities.push(a.name);
          });
          activities = [...partialActivities];
        }
      });
    else activities = [];

    return {
      continents: alphabeticOrder(continents, "asc"),
      activities: alphabeticOrder(activities, "asc"),
    };
  }, [renderCountries, configuredCountries.length]);

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  // COMPONENTS PROPERTIES
  const defaultValues = useMemo(() => {
    return {
      continent: filterConfig.continent
        ? filterConfig.continent
        : filters.continents.length
        ? "Todo"
        : "Sin opciones",
      activity: filterConfig.activity
        ? filterConfig.activity
        : filters.activities.length
        ? "Todo"
        : "Sin opciones",
      alphabet:
        orderConfig.length && orderConfig[0] === "alphabet"
          ? orderConfig[1]
          : configuredCountries.length > 1
          ? "Sin orden"
          : "Sin opciones",
      population:
        orderConfig.length && orderConfig[0] === "population"
          ? orderConfig[1]
          : configuredCountries.length > 1
          ? "Sin orden"
          : "Sin opciones",
    };
  }, [filterConfig, orderConfig, filters, configuredCountries]);

  const defaultOptions = useMemo(() => {
    return {
      continent:
        filters.continents.length !== 1
          ? filters.continents.length === 0
            ? "Sin opciones"
            : "Todo"
          : filters.continents[0],
      activity:
        filters.activities.length !== 1
          ? filters.activities.length === 0
            ? "Sin opciones"
            : "Todo"
          : filters.activities[0],
      order: configuredCountries.length > 1 ? "Sin orden" : "Sin opciones",
    };
  }, [filters, configuredCountries]);

  const options = useMemo(() => {
    return {
      continent:
        filters.continents.length > 1 ? (
          filters.continents.map((c) => {
            return (
              <option value={c} key={c}>
                {c}
              </option>
            );
          })
        ) : (
          <></>
        ),
      activity:
        filters.activities.length > 1 ? (
          filters.activities.map((a) => {
            return (
              <option value={a} key={a}>
                {a}
              </option>
            );
          })
        ) : (
          <></>
        ),
      order: (
        <>
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </>
      ),
    };
  }, [filters]);

  const disabledClearButton = useMemo(() => {
    return {
      filter: filterConfig.continent === "" && filterConfig.activity === "",
      order: !orderConfig.length,
      all:
        !orderConfig.length &&
        filterConfig.continent === "" &&
        filterConfig.activity === "" &&
        nameSelection === "",
    };
  }, [filterConfig, orderConfig, nameSelection]);

  const shufflerHidder = useMemo(() => {
    if (
      !filterConfig.continent.length &&
      !filterConfig.activity.length &&
      !orderConfig.length &&
      !nameSelection.length
    )
      return true;
    return false;
  }, [filterConfig, orderConfig, nameSelection]);

  //////////////////////////////////////////////////////////////////////////////
  // Render
  //////////////////////////////////////////////////////////////////////////////
  return (
    <>
      {/* Shuffle displayed countries BUTTON */}
      {shufflerHidder && <Shuffler countries={[...allCountries]} />}
      <SearchCountry />

      {/* ------------------------------------------------------------------ */}
      {/* Clear BUTTONS */}
      {/* ------------------------------------------------------------------ */}
      {/* FILTERS Clear */}
      <ClearButton
        type="filter"
        disabled={disabledClearButton.filter}
        text="Limpiar filtros"
      />
      {/* ORDER Clear */}
      <ClearButton
        type="order"
        disabled={disabledClearButton.order}
        text="Quitar orden"
      />
      {/* ALL Clear */}
      <ClearButton
        type="all"
        disabled={disabledClearButton.all}
        text="Limpiar todo"
      />
      {/* ------------------------------------------------------------------ */}
      {/* FILTERS AND ORDERS */}
      {/* ------------------------------------------------------------------ */}
      {/* Filter: CONTINENT */}
      <ConfigRender
        name="continent"
        label="Continente: "
        configType="filter"
        disabled={filters.continents.length <= 1}
        defaultValue={defaultValues.continent}
        defaultOption={defaultOptions.continent}
        options={options.continent}
        setConfigOptions={setFilterOptions}
      />
      {/* Filter: ACTIVITY */}
      <ConfigRender
        name="activity"
        label="Actividad turística: "
        configType="filter"
        disabled={filters.activities.length <= 1}
        defaultValue={defaultValues.activity}
        defaultOption={defaultOptions.activity}
        options={options.activity}
        setConfigOptions={setFilterOptions}
      />
      {/* Order: ALPHABET */}
      <ConfigRender
        name="alphabet"
        label="Alfabéticamente: "
        configType="order"
        disabled={configuredCountries.length <= 1}
        defaultValue={defaultValues.alphabet}
        defaultOption={defaultOptions.order}
        options={options.order}
        setConfigOptions={setOrderOptions}
      />
      {/* Order: POPULATION */}
      <ConfigRender
        name="population"
        label="Población: "
        configType="order"
        disabled={configuredCountries.length <= 1}
        defaultValue={defaultValues.population}
        defaultOption={defaultOptions.order}
        options={options.order}
        setConfigOptions={setOrderOptions}
      />
      {/* Pagination component: displays countries */}
      <Pagination showCountries={configuredCountries} />
    </>
  );
}
