import React, { useEffect, useState, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  getCountries,
  setOrderOptions,
  setFilterOptions,
} from "../../redux/actions";
import { Country } from "./Country";

import { shuffle, alphabeticOrder } from "../../controllers";

////////////////////////////////////////////////////////////////////////////////

export function Home() {
  const dispatch = useDispatch();

  const allCountries = useSelector((state) => state.allCountries); // All countries from API
  const selectedCountries = useSelector((state) => state.selectedCountries); // Countries selected by query "name"
  let orderConfig = useSelector((state) => state.orderConfig);
  let filterConfig = useSelector((state) => state.filterConfig);

  if (!localStorage.getItem("selectCountry"))
    localStorage.setItem("selectCountry", "");

  const [selectCountry, setSelectCountry] = useState(
    localStorage.getItem("selectCountry")
  ); // Input for country selection by name

  if (!localStorage.getItem("page")) localStorage.setItem("page", 0);

  const [page, setPage] = useState(localStorage.getItem("page"));

  useEffect(() => {
    if (page === 0) localStorage.setItem("page", 0);
  }, [page]);

  const [errors, setErrors] = useState({});

  // Initial info loading
  let renderCountries = useMemo(() => {
    if (!allCountries.length) dispatch(getCountries());
    return selectCountry === ""
      ? shuffle(allCountries)
      : shuffle(selectedCountries);
  }, [allCountries, selectedCountries]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(getCountries(selectCountry));
    localStorage.setItem("selectCountry", selectCountry);
  }, [selectCountry, dispatch]);

  // Options for continent and activity filters
  let filters = useMemo(() => {
    let continents = [],
      activities = [];
    renderCountries.forEach((c) => {
      if (!continents.includes(c.continent)) continents.push(c.continent);
      if (c.Activities.season && !activities.includes(c.Activities.season))
        activities.push(c.Activities.season);
    });
    return {
      continents: alphabeticOrder(continents, "asc"),
      activities: alphabeticOrder(activities, "asc"),
    };
  }, [renderCountries]);

  function validate(input) {
    let errors = {};
    if (!/^[a-zA-Z\s]+$/.test(input) && input.length)
      errors.input = "Ingresar solo letras y/o espacios";
    return errors;
  }

  function handleInputChange(e) {
    const input = e.target.value;

    setPage(0);

    setSelectCountry((prev) => {
      const newState =
        !/^[a-zA-Z\s]+$/.test(input) && input !== "" ? prev : input;

      setErrors(validate(input));
      return newState;
    });
  }

  function handlePage(e) {
    const page = Number(e.target.innerText) - 1;

    setPage((prev) => {
      localStorage.setItem("page", page);
      return page;
    });
  }

  let configuredCountries = useMemo(() => {
    const filteredRender = renderCountries.filter((c) =>
      filterConfig.continent.length
        ? c.continent === filterConfig.continent
        : true && filterConfig.activity.length
        ? c.Activities.season === filterConfig.activity
        : true
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

  function handleOrder(e) {
    const orderElement = e.target.name,
      orderValue = e.target.value;

    if (orderElement === "population")
      alphabeticOrderRef.current.selected = true;
    if (orderElement === "alphabet") populationOrderRef.current.selected = true;

    orderValue === ""
      ? (orderConfig = [])
      : (orderConfig = [orderElement, orderValue]);
    dispatch(setOrderOptions(orderConfig));

    setPage(0);
  }

  function handleFilter(e) {
    const filterElement = e.target.name,
      filterValue = e.target.value;

    filterConfig = { ...filterConfig, [filterElement]: filterValue };

    dispatch(setFilterOptions(filterConfig));

    setPage(0);
  }

  const continentFilterRef = useRef(),
    activityFilterRef = useRef(),
    alphabeticOrderRef = useRef(),
    populationOrderRef = useRef(),
    nameFilterRef = useRef();

  function handleSingleClear(e) {
    const element = e.target.htmlFor;

    setPage(0);

    switch (element) {
      case "continent":
        continentFilterRef.current.selected = true;
        dispatch(setFilterOptions({ ...filterConfig, [element]: "" }));
        break;
      case "activity":
        activityFilterRef.current.selected = true;
        dispatch(setFilterOptions({ ...filterConfig, [element]: "" }));
        break;
      case "alphabet":
        alphabeticOrderRef.current.selected = true;
        dispatch(setOrderOptions([]));
        break;
      case "population":
        populationOrderRef.current.selected = true;
        dispatch(setOrderOptions([]));
        break;
      default:
    }
  }

  function handleClearFilters() {
    dispatch(setFilterOptions({ continent: "", activity: "" }));
    continentFilterRef.current.selected = true;
    activityFilterRef.current.selected = true;

    setPage(0);
  }

  function handleClearOrder() {
    dispatch(setOrderOptions({ alphabet: "", population: "" }));
    alphabeticOrderRef.current.selected = true;
    populationOrderRef.current.selected = true;

    setPage(0);
  }

  function handleClearConfig() {
    handleClearFilters();
    handleClearOrder();
    setSelectCountry("");
    nameFilterRef.current.value = "";
  }

  return (
    <>
      <input
        ref={nameFilterRef}
        type="search"
        placeholder="Buscar país"
        onChange={handleInputChange}
        value={selectCountry}
      />
      {errors.input && <p>{errors.input}</p>}

      <label htmlFor="continent" onClick={handleSingleClear}>
        Continente:{" "}
      </label>
      <select
        name="continent"
        onChange={handleFilter}
        disabled={filters.continents.length === 1}
        defaultValue={
          filterConfig.continent
            ? filterConfig.continent
            : filters.continents.length
            ? "Todas"
            : "Sin opciones"
        }
      >
        <option value="" ref={continentFilterRef}>
          {filters.continents.length !== 1
            ? filters.continents.length === 0
              ? "Sin opciones"
              : "Todos"
            : filters.continents[0]}
        </option>
        {filters.continents.map((c, id) => {
          return (
            <option value={c} key={id}>
              {c}
            </option>
          );
        })}
      </select>

      <label htmlFor="activity" onClick={handleSingleClear}>
        Actividad:{" "}
      </label>
      <select
        name="activity"
        onChange={handleFilter}
        disabled={!filters.activities.length}
        defaultValue={
          filterConfig.activity
            ? filterConfig.activity
            : filters.activities.length
            ? "Todas"
            : "Sin opciones"
        }
      >
        <option value="" ref={activityFilterRef}>
          {filters.activities.length ? "Todas" : "Sin opciones"}
        </option>
        {filters.activities.map((a, id) => {
          return (
            <option value={a} key={id}>
              {a}
            </option>
          );
        })}
      </select>

      <button
        onClick={handleClearFilters}
        disabled={filterConfig.continent === "" && filterConfig.activity === ""}
      >
        Limpiar filtros
      </button>

      <label htmlFor="alphabet" onClick={handleSingleClear}>
        Alfabéticamente:{" "}
      </label>
      <select
        name="alphabet"
        onChange={handleOrder}
        disabled={configuredCountries.length <= 1}
        defaultValue={
          orderConfig.length && "alphabet" === orderConfig[0]
            ? orderConfig[1]
            : configuredCountries.length > 1
            ? "Sin orden"
            : "Sin opciones"
        }
      >
        <option value="" ref={alphabeticOrderRef}>
          {configuredCountries.length > 1 ? "Sin orden" : "Sin opciones"}
        </option>
        <option value="asc">Ascendente</option>
        <option value="desc">Descendente</option>
      </select>

      <label htmlFor="population" onClick={handleSingleClear}>
        Población:{" "}
      </label>
      <select
        name="population"
        onChange={handleOrder}
        disabled={configuredCountries.length <= 1}
        defaultValue={
          orderConfig.length && "population" === orderConfig[0]
            ? orderConfig[1]
            : configuredCountries.length > 1
            ? "Sin orden"
            : "Sin opciones"
        }
      >
        <option value="" ref={populationOrderRef}>
          {configuredCountries.length > 1 ? "Sin orden" : "Sin opciones"}
        </option>
        <option value="asc">Ascendente</option>
        <option value="desc">Descendente</option>
      </select>

      <button onClick={handleClearOrder} disabled={!orderConfig.length}>
        Limpiar orden
      </button>

      <button
        onClick={handleClearConfig}
        disabled={
          !orderConfig.length &&
          filterConfig.continent === "" &&
          filterConfig.activity === "" &&
          selectCountry === ""
        }
      >
        Limpiar todo
      </button>

      <div>
        {Array.from(
          Array(Math.ceil((configuredCountries.length + 1) / 10) + 1).keys()
        ).map((page, id) => {
          if (id > 0)
            return (
              <div key={id}>
                <button onClick={handlePage}>{page}</button>
              </div>
            );
          return <React.Fragment key={id}></React.Fragment>;
        })}
      </div>

      <div>
        {configuredCountries.map((country, id) => {
          if (
            id >= (page === 0 ? 0 : page * 10 - 1) &&
            id <= (page === 0 ? 8 : page * 10 + 8)
          )
            return (
              <div key={id}>
                <Country
                  name={country.name}
                  continent={country.continent}
                  // flag={country.flag}
                  population={country.population}
                />
              </div>
            );
          return <React.Fragment key={id}></React.Fragment>;
        })}
      </div>
    </>
  );
}
