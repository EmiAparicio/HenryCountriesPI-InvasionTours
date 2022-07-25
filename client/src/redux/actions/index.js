// Import packages
import axios from "axios";

////////////////////////////////////////////////////////////////////////////
// Export ACTION TYPES

// HOME
export const SET_PAGE = "SET_PAGE",
  MODIFY_COUNTRIES = "MODIFY_COUNTRIES",
  SET_ORDER_OPTIONS = "SET_ORDER_OPTIONS",
  SET_FILTER_OPTIONS = "SET_FILTER_OPTIONS";

// COUNTRY DETAIL
export const GET_COUNTRY_DETAIL = "GET_COUNTRY_DETAIL";

// ACTIVITIES
export const SET_COUNTRIES_ID = "SET_COUNTRIES_ID",
  CREATE_ACTIVITY = "CREATE_ACTIVITY",
  SET_ALL_ACTIVITIES_TYPES = "SET_ALL_ACTIVITIES_TYPES";

// GENERAL
export const SET_CLEAR_SEARCH = "SET_CLEAR_SEARCH",
  GET_COUNTRIES = "GET_COUNTRIES",
  SELECT_COUNTRIES = "SELECT_COUNTRIES";

////////////////////////////////////////////////////////////////////////////
// Export FUNCTIONS TO DISPATCH
////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////
// GENERAL
// Get countries from db, all or selected by name as URL query
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

// Store selected country name
export function setNameSelection(name = "") {
  return { type: SELECT_COUNTRIES, payload: name };
}

// Toggle country search cleaning
export function setClearSearch(bool) {
  return { type: SET_CLEAR_SEARCH, payload: bool };
}

////////////////////////////////////////////////////////////////////////////
// HOME
// Store selected page (pagination)
export function setStoredPage(page) {
  return { type: SET_PAGE, payload: page };
}

// Store ORDER selected
export function setOrderOptions(order) {
  return { type: SET_ORDER_OPTIONS, payload: order };
}

// Store FILTERS selected
export function setFilterOptions(filter) {
  return { type: SET_FILTER_OPTIONS, payload: filter };
}

// Function called when Shuffling All Countries
export function modifyCountries(countries) {
  return { type: MODIFY_COUNTRIES, payload: countries };
}

////////////////////////////////////////////////////////////////////////////
// COUNTRY DETAIL
// Get country details, selected by id in params
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

////////////////////////////////////////////////////////////////////////////
// ACTIVITIES
// Post activity to add/associate in db
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

// Store all activity types (names)
export function setAllActivitiesTypes(activities) {
  return { type: SET_ALL_ACTIVITIES_TYPES, payload: activities };
}

// Store countries ids to be associated to added activity
export function setCountriesId(ids) {
  return { type: SET_COUNTRIES_ID, payload: ids };
}
