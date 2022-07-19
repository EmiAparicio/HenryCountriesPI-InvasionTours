import axios from "axios";

export const GET_COUNTRIES = "GET_COUNTRIES",
  SET_ORDER_OPTIONS = "SET_ORDER_OPTIONS",
  SET_FILTER_OPTIONS = "SET_FILTER_OPTIONS",
  GET_COUNTRY_DETAIL = "GET_COUNTRY_DETAIL";

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
