import { put, takeEvery } from "redux-saga/effects";
import { GET_SERVICE, GET_SERVICE_RED, SERVICE_API_ERROR } from "../Constant";
import { getPublicRecord } from "./APICallingService";

function getReason(data = {}) {
  if (typeof data.reason === "object" && data.reason) return Object.values(data.reason).join(", ");
  return data.reason || data.message || "Unable to load services.";
}

function* getServiceSaga(action) {
  const query = action.payload?.query || "limit=24";
  const response = yield getPublicRecord("services/public", query);
  if (!response?.response?.ok || response?.data?.result === "Fail") {
    yield put({ type: SERVICE_API_ERROR, payload: getReason(response?.data) });
    return;
  }
  const data = response?.data?.data || {};
  yield put({
    type: GET_SERVICE_RED,
    payload: {
      services: Array.isArray(data) ? data : data.services || [],
      pagination: response?.data?.pagination || data.pagination || {},
    },
  });
}

export default function* ServiceSagas() {
  yield takeEvery(GET_SERVICE, getServiceSaga);
}
