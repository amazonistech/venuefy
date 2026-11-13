"use client";

import { useSyncExternalStore } from "react";
import { publicApi } from "../lib/publicApi";

const key = "venuefy:customer-session";
const event = "venuefy:session";
let refreshing;

function read() {
  try {
    return sessionStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function getSession() {
  try {
    return JSON.parse(read() || "null");
  } catch {
    return null;
  }
}

export function setSession(value) {
  if (value) sessionStorage.setItem(key, JSON.stringify(value));
  else sessionStorage.removeItem(key);
  window.dispatchEvent(new Event(event));
}

function subscribe(callback) {
  window.addEventListener(event, callback);
  return () => window.removeEventListener(event, callback);
}

export function useCustomer() {
  const raw = useSyncExternalStore(subscribe, read, () => "");
  try {
    return JSON.parse(raw || "null")?.user || null;
  } catch {
    return null;
  }
}

export async function customerApi(path, options) {
  const session = getSession();
  if (!session?.accessToken) throw new Error("Sign in to continue.");
  try {
    return await publicApi(path, { ...options, token: session.accessToken });
  } catch (error) {
    if (error.status !== 401 || options?.signal?.aborted) throw error;
    const current = getSession();
    if (
      !current ||
      (current.user?.id || current.user?._id) !==
        (session.user?.id || session.user?._id)
    )
      throw error;
    if (current.accessToken !== session.accessToken)
      return publicApi(path, { ...options, token: current.accessToken });
    const refreshToken = current.refreshToken;
    if (refreshing?.token !== refreshToken) {
      const job = { token: refreshToken };
      job.promise = publicApi("/auth/refresh-token", { body: { refreshToken } })
        .then((next) => {
          if (getSession()?.refreshToken !== refreshToken)
            throw new Error("Sign in to continue.");
          setSession({ ...current, ...next });
          return next.accessToken;
        })
        .catch((failure) => {
          if (
            [401, 403, 404].includes(failure.status) &&
            getSession()?.refreshToken === refreshToken
          )
            setSession(null);
          throw failure;
        })
        .finally(() => {
          if (refreshing === job) refreshing = null;
        });
      refreshing = job;
    }
    return publicApi(path, { ...options, token: await refreshing.promise });
  }
}

export async function logout() {
  const token = getSession()?.refreshToken;
  setSession(null);
  if (token) await publicApi("/auth/logout", { body: { refreshToken: token } });
}

export function nextPath(value, fallback = "/bookings") {
  return typeof value === "string" &&
    /^\/(?![\\/])/.test(value) &&
    !/[\\\x00-\x1f]/.test(value)
    ? value
    : fallback;
}
