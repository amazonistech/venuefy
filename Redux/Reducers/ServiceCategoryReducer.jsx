import {
  GET_SERVICE_CATEGORY,
  GET_SERVICE_CATEGORY_RED,
  SERVICE_CATEGORY_API_ERROR,
} from "../Constant";

const initialState = {
  items: [],
  pagination: {},
  loading: false,
  error: "",
};

export default function ServiceCategoryReducer(state = initialState, action) {
  switch (action.type) {
    case GET_SERVICE_CATEGORY:
      return { ...state, loading: true, error: "" };
    case GET_SERVICE_CATEGORY_RED:
      return {
        ...state,
        items: action.payload?.categories || [],
        pagination: action.payload?.pagination || {},
        loading: false,
        error: "",
      };
    case SERVICE_CATEGORY_API_ERROR:
      return { ...state, loading: false, error: action.payload || "Unable to load service categories." };
    default:
      return state;
  }
}
