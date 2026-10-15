import { GET_SERVICE_CATEGORY } from "../Constant";

export function getServiceCategory(data = {}) {
  return { type: GET_SERVICE_CATEGORY, payload: data };
}
