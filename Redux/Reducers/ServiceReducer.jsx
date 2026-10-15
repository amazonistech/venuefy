import { GET_SERVICE, GET_SERVICE_RED, SERVICE_API_ERROR } from "../Constant";

const initialState = {
  items: [],
  pagination: {},
  loading: false,
  error: "",
};

export default function ServiceReducer(state = initialState, action) {
  switch (action.type) {
    case GET_SERVICE:
      return { ...state, loading: true, error: "" };
    case GET_SERVICE_RED:
      return {
        ...state,
        items: action.payload?.services || [],
        pagination: action.payload?.pagination || {},
        loading: false,
        error: "",
      };
    case SERVICE_API_ERROR:
      return { ...state, loading: false, error: action.payload || "Unable to load services." };
    default:
      return state;
  }
}
