import { put, takeEvery } from "redux-saga/effects";
import {
  API_ERROR,
  GET_VENUE_CATEGORY,
  GET_VENUE_CATEGORY_RED,
} from "../Constant";
import { getPublicRecord } from "./APICallingService";

function getReason(data = {}) {
  return typeof data.reason === "object"
    ? Object.values(data.reason || {}).join(", ")
    : data.reason || data.message || "Request failed.";
}

function* getSaga(action) {
  const query = action.payload?.query || "limit=100";
  const response = yield getPublicRecord("venue-categories/public", query);
  if (!response?.response?.ok || response?.data?.result === "Fail") {
    yield put({ type: API_ERROR, payload: getReason(response?.data) });
    return;
  }
  yield put({
    type: GET_VENUE_CATEGORY_RED,
    payload: response?.data?.data || {},
  });
}

export default function* VenueCategorySagas() {
  yield takeEvery(GET_VENUE_CATEGORY, getSaga);
}
