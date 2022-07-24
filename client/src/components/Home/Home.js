/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCountries,
  setFilterOptions,
  setOrderOptions,
} from "../../redux/actions";

import { SearchCountry } from "../SearchCountry";
import { Pagination } from "./Pagination/Pagination";
import { Shuffler } from "../Shuffler";
import { ConfigRender } from "./ConfigRender";
import { alphabeticOrder } from "../../controllers";

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

  const allCountries = useSelector((state) => state.allCountries);

  const nameSelection = useSelector((state) => state.nameSelection);
  const selectedCountries = useSelector((state) => state.selectedCountries);

  useEffect(() => {
    if (!allCountries.length) dispatch(getCountries());
  }, [allCountries]);

  const renderCountries = useMemo(() => {
    return nameSelection === "" ? allCountries : selectedCountries;
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

  const [partialActivities, setPartialActivities] = useState([]);
  const filters = useMemo(() => {
    let [continents, activities] = [[], []];

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

  return (
    <>
      {/* solo activar shuffler si no hay filtros activos */}
      <Shuffler countries={[...allCountries]} />
      <SearchCountry />
      <ConfigRender
        name="continent"
        label="Continente: "
        configType="filter"
        disabled={filters.continents.length < 1}
        defaultValue={
          filterConfig.continent
            ? filterConfig.continent
            : filters.continents.length
            ? "Todo"
            : "Sin opciones"
        }
        defaultOption={
          filters.continents.length !== 1
            ? filters.continents.length === 0
              ? "Sin opciones"
              : "Todo"
            : filters.continents[0]
        }
        options={
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
          )
        }
        setConfigOptions={setFilterOptions}
      />
      <ConfigRender
        name="alphabet"
        label="Alfabéticamente: "
        configType="order"
        disabled={configuredCountries.length <= 1}
        defaultValue={
          orderConfig.length && "alphabet" === orderConfig[0]
            ? orderConfig[1]
            : configuredCountries.length > 1
            ? "Sin orden"
            : "Sin opciones"
        }
        defaultOption={
          configuredCountries.length > 1 ? "Sin orden" : "Sin opciones"
        }
        options={
          <>
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </>
        }
        setConfigOptions={setOrderOptions}
      />
      <ConfigRender
        name="population"
        label="Población: "
        configType="order"
        disabled={configuredCountries.length <= 1}
        defaultValue={
          orderConfig.length && "population" === orderConfig[0]
            ? orderConfig[1]
            : configuredCountries.length > 1
            ? "Sin orden"
            : "Sin opciones"
        }
        defaultOption={
          configuredCountries.length > 1 ? "Sin orden" : "Sin opciones"
        }
        options={
          <>
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </>
        }
        setConfigOptions={setOrderOptions}
      />
      <Pagination showCountries={configuredCountries} />
    </>
  );
}
