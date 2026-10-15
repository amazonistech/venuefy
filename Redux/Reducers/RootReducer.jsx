import { combineReducers } from "redux";
import VenueReducer from "./VenueReducer";
import VenueCategoryReducer from "./VenueCategoryReducer";
import ServiceReducer from "./ServiceReducer";
import ServiceCategoryReducer from "./ServiceCategoryReducer";

export default combineReducers({
  VenueReducer,
  VenueCategoryReducer,
  ServiceReducer,
  ServiceCategoryReducer,
});
