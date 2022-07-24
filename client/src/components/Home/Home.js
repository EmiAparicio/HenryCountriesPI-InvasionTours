/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCountries,
  setAllActivitiesTypes,
  setFilterOptions,
  setOrderOptions,
  setStoredPage,
} from "../../redux/actions";

import { SearchCountry } from "../SearchCountry";
import { Pagination } from "./Pagination/Pagination";
import { Shuffler } from "../Shuffler";
import { ConfigRender } from "./ConfigRender";
import { alphabeticOrder } from "../../controllers";
import { ClearButton } from "./ClearButton";
import { useNavigate } from "react-router-dom";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const nameSelection = useSelector((state) => state.nameSelection);

  useEffect(() => {
    dispatch(setStoredPage(1));
    navigate("/home?page=1", { replace: true });
  }, [nameSelection]);

  const allCountries = useSelector((state) => state.allCountries);
  const selectedCountries = useSelector((state) => state.selectedCountries);

  useEffect(() => {
    if (!allCountries.length) dispatch(getCountries());
  }, [allCountries]);

  const renderCountries = useMemo(() => {
    return nameSelection === "" ? [...allCountries] : [...selectedCountries];
  }, [allCountries, selectedCountries]);

  const orderConfig = useSelector((state) => state.orderConfig);
  const filterConfig = useSelector((state) => state.filterConfig);

  const configuredCountries = useMemo(() => {
    const filteredRender = renderCountries.filter(
      (c) =>
        (filterConfig.continent.length
          ? c.continent === filterConfig.continent
          : true) &&
        (filterConfig.activity.length
          ? c.Activities.reduce((bool, act) => {
              return bool || act.name === filterConfig.activity;
            }, false)
          : true)
    );

    let configuredRender = filteredRender;

    if (orderConfig.length && orderConfig[0] === "alphabet") {
      configuredRender = alphabeticOrder(
        filteredRender,
        orderConfig[1],
        "name"
      );
    } else if (orderConfig.length && orderConfig[0] === "population") {
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

  /////////////////////////////////////////

  const allActivitiesTypes = useSelector((state) => state.allActivitiesTypes);

  useEffect(() => {
    dispatch(getCountries());
  }, [allActivitiesTypes.length]);

  useEffect(() => {
    let activities = [...allActivitiesTypes];
    renderCountries.forEach((c) => {
      c.Activities?.forEach((a) => {
        if (!activities.includes(a.name)) activities.push(a.name);
      });
    });
    dispatch(setAllActivitiesTypes(activities));
  }, [renderCountries]);

  const [partialActivities, setPartialActivities] = useState([]);
  const filters = useMemo(() => {
    let [continents, activities] = [[], [...allActivitiesTypes]];

    if (configuredCountries.length)
      renderCountries.forEach((c) => {
        if (!continents.includes(c.continent)) continents.push(c.continent);

        if (renderCountries.length !== allCountries.length) {
          c.Activities?.forEach((a) => {
            if (!activities.includes(a.name))
              setPartialActivities((prev) => [...prev, a.name]);
          });
          activities = partialActivities;
        }
      });
    else activities = [];

    return {
      continents: alphabeticOrder(continents, "asc"),
      activities: alphabeticOrder(activities, "asc"),
    };
  }, [renderCountries, configuredCountries]);

  /////////////////////////////////////////
  /////////////////////////////////////////
  // Components properties
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
      activity: filters.activities.length ? "Todo" : "Sin opciones",
      order: configuredCountries.length > 1 ? "Sin orden" : "Sin opciones",
    };
  }, [filters, configuredCountries]);

  const options = useMemo(() => {
    return {
      continent:
        filters.continents.length > 1 ? (
          filters.continents.map((c, id) => {
            return (
              <option value={c} key={c}>
                {c}
              </option>
            );
          })
        ) : (
          <></>
        ),
      activity: filters.activities.map((a, id) => {
        return (
          <option value={a} key={a}>
            {a}
          </option>
        );
      }),
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

  return (
    <>
      {shufflerHidder && <Shuffler countries={[...allCountries]} />}
      <SearchCountry />

      <ClearButton
        clear="filter"
        disabled={disabledClearButton.filter}
        text="Limpiar filtros"
      />

      <ClearButton
        clear="order"
        disabled={disabledClearButton.order}
        text="Quitar orden"
      />

      <ClearButton
        clear="all"
        disabled={disabledClearButton.all}
        text="Limpiar todo"
      />

      <ConfigRender
        name="continent"
        label="Continente: "
        configType="filter"
        disabled={filters.continents.length < 1}
        defaultValue={defaultValues.continent}
        defaultOption={defaultOptions.continent}
        options={options.continent}
        setConfigOptions={setFilterOptions}
      />
      <ConfigRender
        name="activity"
        label="Actividad turística: "
        configType="filter"
        disabled={filters.activities.length < 1}
        defaultValue={defaultValues.activity}
        defaultOption={defaultOptions.activity}
        options={options.activity}
        setConfigOptions={setFilterOptions}
      />
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
      <Pagination showCountries={configuredCountries} />
    </>
  );
}
