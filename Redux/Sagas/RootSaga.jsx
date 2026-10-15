import { all } from "redux-saga/effects";
import VenueSagas from "./VenueSagas";
import VenueCategorySagas from "./VenueCategorySagas";
import ServiceSagas from "./ServiceSagas";
import ServiceCategorySagas from "./ServiceCategorySagas";
export default function* RootSaga() {
  yield all([VenueSagas(), VenueCategorySagas(), ServiceSagas(), ServiceCategorySagas()]);
}
