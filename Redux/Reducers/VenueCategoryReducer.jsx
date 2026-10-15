import {
  GET_VENUE_CATEGORY,
  GET_VENUE_CATEGORY_RED,
  API_ERROR,
} from "../Constant";

const initialState = {
  items: [],
  pagination: {},
  loading: false,
  error: "",
  response: null,
};

export default function VenueCategoryReducer(state = initialState, action) {
  switch (action.type) {
    case GET_VENUE_CATEGORY:
      return { ...state, loading: true, error: "" };
    case GET_VENUE_CATEGORY_RED:
      return {
        ...state,
        items: action.payload?.categories || [],
        pagination: action.payload?.pagination || {},
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
