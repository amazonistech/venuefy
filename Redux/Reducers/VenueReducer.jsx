import {
  GET_VENUE,
  GET_VENUE_RED,
  GET_VENUE_DETAILS,
  GET_VENUE_DETAILS_RED,
  API_ERROR,
} from "../Constant";

const initialState = {
  items: [],
  selected: null,
  pagination: {},
  loading: false,
  error: "",
  response: null,
};

export default function VenueReducer(state = initialState, action) {
  switch (action.type) {
    case GET_VENUE:
      return { ...state, loading: true, error: "" };
    case GET_VENUE_DETAILS:
      return { ...state, selected: null, loading: true, error: "" };
    case GET_VENUE_RED:
      return {
        ...state,
        items: action.payload?.venues || [],
        pagination: action.payload?.pagination || {},
        loading: false,
        error: "",
        response: action.payload,
      };
    case GET_VENUE_DETAILS_RED:
      return {
        ...state,
        selected: action.payload,
        loading: false,
        error: "",
        response: action.payload,
      };
    case API_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
