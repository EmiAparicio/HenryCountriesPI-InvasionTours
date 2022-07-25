import axios from "axios";

export const GET_COUNTRIES = "GET_COUNTRIES",
  SELECT_COUNTRIES = "SELECT_COUNTRIES",
  SET_ORDER_OPTIONS = "SET_ORDER_OPTIONS",
  SET_FILTER_OPTIONS = "SET_FILTER_OPTIONS",
  GET_COUNTRY_DETAIL = "GET_COUNTRY_DETAIL",
  CREATE_ACTIVITY = "CREATE_ACTIVITY",
  SET_ALL_ACTIVITIES_TYPES = "SET_ALL_ACTIVITIES_TYPES";

// HOME action types
export const SET_PAGE = "SET_PAGE",
  MODIFY_COUNTRIES = "MODIFY_COUNTRIES";

// ACTIVITIES action types
export const SET_COUNTRIES_ID = "SET_COUNTRIES_ID";

// GENERAL action types
export const SET_CLEAR_SEARCH = "SET_CLEAR_SEARCH";

export function getCountries(name = "?") {
  return function (dispatch) {
    fetch(
      `http://localhost:3001/countries${
        name !== "?" && name !== "" ? `?name=${name}` : ""
      }`
    )
      .then((response) => response.json())
      .then((countries) => {
        dispatch({
          type: GET_COUNTRIES,
          payload:
            name !== "?"
              ? name === ""
                ? { partial: true, countries: [] }
                : { partial: true, countries }
              : { partial: false, countries },
        });
      });
  };
}

export function setNameSelection(name = "") {
  return { type: SELECT_COUNTRIES, payload: name };
}

export function setOrderOptions(order) {
  return { type: SET_ORDER_OPTIONS, payload: order };
}

export function setFilterOptions(filter) {
  return { type: SET_FILTER_OPTIONS, payload: filter };
}

export function getCountryDetail(id) {
  return async function (dispatch) {
    if (id) {
      const resp = await axios.get(`http://localhost:3001/countries/${id}`);
      dispatch({
        type: GET_COUNTRY_DETAIL,
        payload: resp.data,
      });
    } else dispatch({ type: GET_COUNTRY_DETAIL, payload: {} });
  };
}

export function createActivity(activity) {
  return activity
    ? function (dispatch) {
        axios
          .post("http://localhost:3001/activities", activity)
          .then((resp) => {
            dispatch({ type: CREATE_ACTIVITY, payload: resp.data });
          });
      }
    : { type: CREATE_ACTIVITY, payload: {} };
}

export function setAllActivitiesTypes(activities) {
  return { type: SET_ALL_ACTIVITIES_TYPES, payload: activities };
}

export function setStoredPage(page) {
  // localStorage.setItem("page", page);
  return { type: SET_PAGE, payload: page };
}

export function modifyCountries(countries) {
  return { type: MODIFY_COUNTRIES, payload: countries };
}

export function setClearSearch(bool) {
  return { type: SET_CLEAR_SEARCH, payload: bool };
}

export function setCountriesId(ids) {
  return { type: SET_COUNTRIES_ID, payload: ids };
}
