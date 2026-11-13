"use client";

import { useSyncExternalStore } from "react";

const storageKey = "venuefy:saved";
const empty = '{"shortlist":[],"compare":[]}';
function getSnapshot() {
  try {
    return localStorage.getItem(storageKey) || empty;
  } catch {
    return empty;
  }
}
function subscribe(callback) {
  window.addEventListener("venuefy:saved", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("venuefy:saved", callback);
    window.removeEventListener("storage", callback);
  };
}

export function useSaved() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => empty);
  try {
    return JSON.parse(raw);
  } catch {
    return JSON.parse(empty);
  }
}

export function toggleSaved(kind, card) {
  let current;
  try {
    current = JSON.parse(getSnapshot());
  } catch {
    current = JSON.parse(empty);
  }
  const items = current[kind] || [];
  const exists = items.some((item) => item.id === card.id);
  if (!exists && kind === "compare" && items.length >= 4)
    return "Compare up to four venues. Remove one to add another.";
  current[kind] = exists
    ? items.filter((item) => item.id !== card.id)
    : [...items, card];
  try {
    localStorage.setItem(storageKey, JSON.stringify(current));
  } catch {
    return "This browser could not save the venue.";
  }
  window.dispatchEvent(new Event("venuefy:saved"));
  return "";
}
