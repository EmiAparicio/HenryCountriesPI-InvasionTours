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

// CSS
import { LetRender } from "../LetRender";
import homeMain from "../../styles/components/Home/Home.module.css";

import configMain from "../../styles/components/Home/ConfigRender.module.css";

const home = homeMain; //homeMain invadedHome

const config = configMain; // configMain invadedConfig

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
              <option value={c} key={c} className={`${config.option}`}>
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
              <option value={a} key={a} className={`${config.option}`}>
                {a}
              </option>
            );
          })
        ) : (
          <></>
        ),
      order: (
        <>
          <option value="asc" className={`${config.option}`}>
            Ascendente
          </option>
          <option value="desc" className={`${config.option}`}>
            Descendente
          </option>
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
    <div>
      <LetRender />
      <div className={`${home.container}`}>
        <div className={`${home.filters}`}>
          <div className={`${home.clearFilters}`}>
            {/* FILTERS Clear */}
            <ClearButton
              type="filter"
              disabled={disabledClearButton.filter}
              text="Limpiar filtros"
            />
          </div>
          <div className={`${home.continentFilter}`}>
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
          </div>
          <div className={`${home.activityFilter}`}>
            {/* Filter: ACTIVITY */}
            <ConfigRender
              name="activity"
              label="Actividad: "
              configType="filter"
              disabled={filters.activities.length <= 1}
              defaultValue={defaultValues.activity}
              defaultOption={defaultOptions.activity}
              options={options.activity}
              setConfigOptions={setFilterOptions}
            />
          </div>
        </div>
        <div className={`${home.order}`}>
          <div className={`${home.clearOrder}`}>
            {/* ORDER Clear */}
            <ClearButton
              type="order"
              disabled={disabledClearButton.order}
              text="Quitar orden"
            />
          </div>
          <div className={`${home.alphabetOrder}`}>
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
          </div>
          <div className={`${home.populationOrder}`}>
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
          </div>
        </div>
        <div className={`${home.country}`}>
          {/* Shuffle displayed countries BUTTON */}
          {
            <Shuffler
              countries={[...allCountries]}
              shufflerHidder={shufflerHidder}
            />
          }

          <div className={`${home.clearAll}`}>
            {/* ALL Clear */}
            <ClearButton
              type="all"
              disabled={disabledClearButton.all}
              text="Limpiar todo"
            />
          </div>

          {/* Search country by name */}
          <SearchCountry />
        </div>
      </div>

      {/* Pagination component: displays countries */}
      <Pagination showCountries={configuredCountries} />
    </div>
  );
}
