import { GET_COUNTRIES } from "../actions";

////////////////////////////////////////////////////////////////////////////////

const initialState = {
  allCountries: [],
  selectedCountries: [],
  page: 0,
};

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case GET_COUNTRIES:
      if (action.payload.partial)
        return { ...state, selectedCountries: action.payload.countries };
      else return { ...state, allCountries: action.payload.countries };
    default:
      return state;
  }
}
