import React, { useEffect, useState, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  getCountries,
  setNameSelection,
  setOrderOptions,
  setFilterOptions,
  setAllActivitiesTypes,
} from "../../redux/actions";
import { Country } from "./Country";

import { alphabeticOrder, validateLetters } from "../../controllers";

////////////////////////////////////////////////////////////////////////////////

export function Home() {
  const dispatch = useDispatch();

  ////////////////////////////////////////////////////////////////////
  // Pages handling
  ////////////////////////////////////////////////////////////////////
  if (!localStorage.getItem("page")) localStorage.setItem("page", 0);
  const [page, setPage] = useState(localStorage.getItem("page"));

  useEffect(() => {
    if (page === 0) localStorage.setItem("page", 0);
  }, [page]);

  function handlePage(e) {
    const page = Number(e.target.innerText) - 1;

    setPage(() => {
      localStorage.setItem("page", page);
      return page;
    });
  }

  ////////////////////////////////////////////////////////////////////
  // Data loading
  ////////////////////////////////////////////////////////////////////
  // Initial countries loading
  const allCountries = useSelector((state) => state.allCountries);

  useEffect(() => {
    if (!allCountries.length) dispatch(getCountries());
  }, [allCountries, dispatch]);

  // Render countries: all of selected if case
  const selectedCountries = useSelector((state) => state.selectedCountries);
  const [renderCountries, setRenderCountries] = useState([]);

  useEffect(() => {
    setRenderCountries(() =>
      selectCountry === "" ? allCountries : selectedCountries
    );
  }, [allCountries, selectedCountries]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load selected countries by name from input
  const nameSelection = useSelector((state) => state.nameSelection);
  const [selectCountry, setSelectCountry] = useState(nameSelection);

  useEffect(() => {
    dispatch(getCountries(selectCountry));
    dispatch(setNameSelection(selectCountry));
  }, [selectCountry, dispatch]);

  const [errors, setErrors] = useState({});

  function handleInputChange(e) {
    const input = e.target.value;

    setPage(0);

    setSelectCountry((prev) => {
      const newState =
        !/^[a-zA-Z\s]+$/.test(input) && input !== "" ? prev : input;

      setErrors(validateLetters(input));
      return newState;
    });
  }

  ////////////////////////////////////////////////////////////////////
  // Data manipulation
  ////////////////////////////////////////////////////////////////////
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
  }, [orderConfig, filterConfig, renderCountries]); // eslint-disable-line react-hooks/exhaustive-deps

  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////

  const allActivitiesTypes = useSelector((state) => state.allActivitiesTypes);
  useEffect(() => {
    let activities = [...allActivitiesTypes];

    // if (
    //   localStorage.getItem("totalActivities") &&
    //   localStorage.getItem("totalActivities") > activities.length
    // ) {
    allCountries.forEach((c) => {
      c.Activities?.forEach((a) => {
        if (!activities.includes(a.name)) activities.push(a.name);
      });
    });
    dispatch(setAllActivitiesTypes(activities));
    // console.log("dispatched");
    // }

    // localStorage.setItem("totalActivities", activities.length);

    //
  }, [allCountries]); // eslint-disable-line react-hooks/exhaustive-deps

  // const renderCountries = useMemo(() => {
  //   if (!allCountries.length) dispatch(getCountries());

  //   return nameSelection === ""
  //     ? shuffle(allCountries)
  //     : shuffle(selectedCountries);
  // }, [allCountries, selectedCountries]); // eslint-disable-line react-hooks/exhaustive-deps
  /////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////
  // const [filters, setDummyFilter] = useState({
  //   continents: [],
  //   activities: [...allActivitiesTypes],
  // });
  const [partialActivities, setPartialActivities] = useState([]);
  const filters = useMemo(() => {
    // let continents = [],
    //   activities = [...filters];

    //CAMBIAR: SI ELIJO CONTINENTE AFRICA, Y ESCRIBO UN NOMBRE ME LO FILTRA, PERO CUANDO BORRO UNA LETRA DEL PAIS, EL FILTRO DE CONTINENTE VUELVE A "TODOS" Y DEBERÍA QUEDARSE EN AFRICA

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
    // setDummyFilter(() => ({
    //   continents: alphabeticOrder(continents, "asc"),
    //   activities: alphabeticOrder(activities, "asc"),
    // }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderCountries, allActivitiesTypes, configuredCountries]);

  // Options for continent and activity filters

  // const createdActivity = useSelector((state) => state.createdActivity);
  // let [dummyFilter, setDummyFilter] = useState(
  //   JSON.parse(localStorage.getItem("changedAct"))
  // );

  // const filters = useMemo(() => {
  //   let continents = [],
  //     activities = [...dummyFilter];

  //   renderCountries.forEach((c) => {
  //     if (!continents.includes(c.continent)) continents.push(c.continent);

  //     c.Activities?.forEach((a) => {
  //       if (!activities.includes(a.season)) activities.push(a.season);
  //     });
  //   });

  //   setDummyFilter(() => alphabeticOrder(activities, "asc"));
  //   console.log(activities);
  //   return {
  //     continents: alphabeticOrder(continents, "asc"),
  //     activities: alphabeticOrder(activities, "asc"),
  //   };
  // }, [renderCountries, dummyFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////

  function handleOrder(e) {
    const orderElement = e.target.name,
      orderValue = e.target.value;

    if (orderElement === "population")
      alphabeticOrderRef.current.selected = true;
    if (orderElement === "alphabet") populationOrderRef.current.selected = true;

    dispatch(
      setOrderOptions(orderValue === "" ? [] : [orderElement, orderValue])
    );

    setPage(0);
  }

  function handleFilter(e) {
    const filterElement = e.target.name,
      filterValue = e.target.value;

    dispatch(
      setFilterOptions({ ...filterConfig, [filterElement]: filterValue })
    );

    setPage(0);
  }

  const continentFilterRef = useRef(),
    activityFilterRef = useRef(),
    alphabeticOrderRef = useRef(),
    populationOrderRef = useRef();

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
    dispatch(setOrderOptions([]));
    alphabeticOrderRef.current.selected = true;
    populationOrderRef.current.selected = true;

    setPage(0);
  }

  function handleClearConfig() {
    handleClearFilters();
    handleClearOrder();
    setSelectCountry("");
  }

  return (
    <>
      <input
        type="search"
        placeholder="Buscar país"
        onChange={handleInputChange}
        value={selectCountry}
        onBlur={() => setErrors((prev) => ({ err: "" }))}
      />
      {errors.err && <p>{errors.err}</p>}

      <label htmlFor="continent" onClick={handleSingleClear}>
        Continente:{" "}
      </label>
      <select
        name="continent"
        onChange={handleFilter}
        disabled={filters.continents.length < 1}
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
        {filters.continents.length > 1 ? (
          filters.continents.map((c, id) => {
            return (
              <option value={c} key={c}>
                {c}
              </option>
            );
          })
        ) : (
          <></>
        )}
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
            <option value={a} key={a}>
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
          nameSelection === ""
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
                  id={country.id}
                />
              </div>
            );
          return <React.Fragment key={id}></React.Fragment>;
        })}
      </div>
    </>
  );
}
