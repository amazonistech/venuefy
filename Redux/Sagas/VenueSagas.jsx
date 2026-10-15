import { put, takeEvery } from "redux-saga/effects";
import {
  API_ERROR,
  GET_VENUE,
  GET_VENUE_DETAILS,
  GET_VENUE_DETAILS_RED,
  GET_VENUE_RED,
} from "../Constant";
import { getPublicRecord } from "./APICallingService";

function getReason(data = {}) {
  return typeof data.reason === "object"
    ? Object.values(data.reason || {}).join(", ")
    : data.reason || data.message || "Request failed.";
}

function* getVenueSaga(action) {
  const query = action.payload?.query || "limit=100";
  const response = yield getPublicRecord("venue/public", query);
  if (!response?.response?.ok || response?.data?.result === "Fail") {
    yield put({ type: API_ERROR, payload: getReason(response?.data) });
    return;
  }
  yield put({ type: GET_VENUE_RED, payload: response?.data?.data || {} });
}

function* getVenueDetailsSaga(action) {
  const response = yield getPublicRecord(`venue/public/${action.payload}`);
  if (!response?.response?.ok || response?.data?.result === "Fail") {
    yield put({ type: API_ERROR, payload: getReason(response?.data) });
    return;
  }
  yield put({
    type: GET_VENUE_DETAILS_RED,
    payload: response?.data?.data || null,
  });
}

export default function* VenueSagas() {
  yield takeEvery(GET_VENUE, getVenueSaga);
  yield takeEvery(GET_VENUE_DETAILS, getVenueDetailsSaga);
}
