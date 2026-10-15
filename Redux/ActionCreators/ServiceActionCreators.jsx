import { GET_SERVICE } from "../Constant";

export function getService(data = {}) {
  return { type: GET_SERVICE, payload: data };
}
