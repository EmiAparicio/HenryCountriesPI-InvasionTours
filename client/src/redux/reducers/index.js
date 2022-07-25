// Import action types
import {
  GET_COUNTRIES,
  SELECT_COUNTRIES,
  SET_FILTER_OPTIONS,
  SET_ORDER_OPTIONS,
  GET_COUNTRY_DETAIL,
  CREATE_ACTIVITY,
  SET_ALL_ACTIVITIES_TYPES,

  // HOME
  SET_PAGE,
  MODIFY_COUNTRIES,

  // ACTIVITIES
  SET_COUNTRIES_ID,

  // GENERAL
  SET_CLEAR_SEARCH,
} from "../actions";

///////////////////////////////////////////////////////////////////////////////
// Code
///////////////////////////////////////////////////////////////////////////////

const initialState = {
  allCountries: [], // All countries from back: /countries
  nameSelection: "", // Name filter
  selectedCountries: [], // Selected countries from back: /countries?name
  orderConfig: [], // Order configuration: ["population/alphabet", "asc, desc"]
  filterConfig: {
    // Filters applied
    continent: "", // Show only countries of this continent
    activity: "", // Show only countries with this activity
  },
  countryDetail: {}, // Selected country details from back: /countries/:id
  createdActivity: {}, // New created or assigned activity
  allActivitiesTypes: [], // All activities different names

  // HOME
  page: localStorage.getItem("page") ? Number(localStorage.getItem("page")) : 1, // Actual page of countries shown
  // ACTIVITIES
  countriesId: [],
  // GENERAL
  clearSearch: false,
};

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case GET_COUNTRIES:
      if (action.payload.partial)
        return { ...state, selectedCountries: action.payload.countries };
      else return { ...state, allCountries: action.payload.countries };
    case SELECT_COUNTRIES:
      return { ...state, nameSelection: action.payload };
    case GET_COUNTRY_DETAIL:
      return { ...state, countryDetail: action.payload };
    case SET_ORDER_OPTIONS:
      return { ...state, orderConfig: action.payload };
    case SET_FILTER_OPTIONS:
      return action.payload.name
        ? {
            ...state,
            filterConfig: {
              ...state.filterConfig,
              [action.payload.name]: action.payload[action.payload.name],
            },
          }
        : { ...state, filterConfig: action.payload };
    case SET_COUNTRIES_ID:
      return { ...state, countriesId: action.payload };
    case CREATE_ACTIVITY:
      return { ...state, createdActivity: action.payload };
    case SET_ALL_ACTIVITIES_TYPES:
      return {
        ...state,
        allActivitiesTypes: action.payload,
      };
    case SET_PAGE:
      return { ...state, page: action.payload };
    case MODIFY_COUNTRIES:
      return { ...state, allCountries: action.payload };
    case SET_CLEAR_SEARCH:
      return { ...state, clearSearch: action.payload };
    default:
      return state;
  }
}
