"use client";
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import RootReducer from "./Reducers/RootReducer";
import RootSaga from "./Sagas/RootSaga";
const Saga = createSagaMiddleware();
const Store = configureStore({
  reducer: RootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(Saga),
});
Saga.run(RootSaga);
export default Store;
