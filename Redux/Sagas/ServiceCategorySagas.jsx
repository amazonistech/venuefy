import { put, takeEvery } from "redux-saga/effects";
import {
  GET_SERVICE_CATEGORY,
  GET_SERVICE_CATEGORY_RED,
  SERVICE_CATEGORY_API_ERROR,
} from "../Constant";
import { getPublicRecord } from "./APICallingService";

function getReason(data = {}) {
  if (typeof data.reason === "object" && data.reason) return Object.values(data.reason).join(", ");
  return data.reason || data.message || "Unable to load service categories.";
}

function* getServiceCategorySaga(action) {
  const query = action.payload?.query || "limit=100";
  const response = yield getPublicRecord("service-categories/public", query);
  if (!response?.response?.ok || response?.data?.result === "Fail") {
    yield put({ type: SERVICE_CATEGORY_API_ERROR, payload: getReason(response?.data) });
    return;
  }
  const data = response?.data?.data || {};
  yield put({
    type: GET_SERVICE_CATEGORY_RED,
    payload: {
      categories: Array.isArray(data) ? data : data.categories || [],
      pagination: response?.data?.pagination || data.pagination || {},
    },
  });
}

export default function* ServiceCategorySagas() {
  yield takeEvery(GET_SERVICE_CATEGORY, getServiceCategorySaga);
}
