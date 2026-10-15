import { GET_VENUE, GET_VENUE_DETAILS } from "../Constant";

export function getVenue(data = {}) {
  return { type: GET_VENUE, payload: data };
}

export function getVenueDetails(data) {
  return { type: GET_VENUE_DETAILS, payload: data };
}
