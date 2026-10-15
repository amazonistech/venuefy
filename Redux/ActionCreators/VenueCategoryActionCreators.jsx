import { GET_VENUE_CATEGORY } from "../Constant";
export function getVenueCategory(data) {
  return { type: GET_VENUE_CATEGORY, payload: data };
}
