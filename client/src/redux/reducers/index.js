import {
  GET_COUNTRIES,
  SET_FILTER_OPTIONS,
  SET_ORDER_OPTIONS,
  GET_COUNTRY_DETAIL,
} from "../actions";

////////////////////////////////////////////////////////////////////////////////

const initialState = {
  allCountries: [],
  selectedCountries: [],
  countryDetail: { hola: "hola" },
  orderConfig: [],
  filterConfig: {
    continent: "",
    activity: "",
  },
};

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case GET_COUNTRIES:
      if (action.payload.partial)
        return { ...state, selectedCountries: action.payload.countries };
      else return { ...state, allCountries: action.payload.countries };
    case GET_COUNTRY_DETAIL:
      return { ...state, countryDetail: action.payload };
    case SET_ORDER_OPTIONS:
      return { ...state, orderConfig: action.payload };
    case SET_FILTER_OPTIONS:
      return { ...state, filterConfig: action.payload };
    default:
      return state;
  }
}
