"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import SearchBar from "./SearchBar";
import VenueCard from "./VenueCard";
import ServiceCard from "./ServiceCard";
import ListingMap from "./ListingMap";
import usePublicData from "./usePublicData";
import { hrefWith, publicApi } from "../lib/publicApi";
import { mapServiceCard, mapVenueCard } from "../lib/venueMapper";

function PageResults({ endpoint, kind, filters }) {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const sentinel = useRef(null);
  const active = useRef(null);
  const next = useRef(1);
  const exhausted = useRef(false);

  const load = useCallback(async () => {
    if (active.current || exhausted.current) return;
    const controller = new AbortController();
    active.current = controller;
    setBusy(true);
    setError("");
    try {
      const data = await publicApi(
        hrefWith(endpoint, { ...filters, page: next.current, limit: 24 }),
        { signal: controller.signal },
      );
      if (controller.signal.aborted) return;
      const batch = data[kind] || [];
      const page = next.current++;
      exhausted.current =
        !batch.length ||
        page >=
          (data.pagination?.totalPages ??
            (batch.length < 24 ? page : Infinity));
      setRows((current) => [
        ...new Map(
          [...current, ...batch].map((item) => [item._id, item]),
        ).values(),
      ]);
      setTotal(data.pagination?.totalRecords ?? null);
    } catch (error) {
      if (!controller.signal.aborted) setError(error.message);
    } finally {
      if (active.current === controller) {
        active.current = null;
        setBusy(false);
      }
    }
  }, [endpoint, kind, filters]);

  useEffect(() => {
    load();
    return () => {
      active.current?.abort();
      active.current = null;
    };
  }, [load]);

  useEffect(() => {
    if (
      busy ||
      error ||
      !rows.length ||
      exhausted.current ||
      !sentinel.current ||
      !("IntersectionObserver" in window)
    )
      return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) load();
      },
      { rootMargin: "0px 0px 120px" },
    );
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [busy, error, load, rows.length]);

  const service = kind === "services";
  const cards = useMemo(
    () => rows.map(service ? mapServiceCard : mapVenueCard),
    [rows, service],
  );
  return (
    <>
      <h1>
        {total !== null ? `${total} ` : ""}
        {service ? "Event services" : "Venues"}
        {filters.city ? ` in ${filters.city}` : ""}
      </h1>
      <p className="catalog-caption">
        {filters.search
          ? `Results for “${filters.search}”`
          : "Explore listings that match your plans"}
      </p>
      <div className="catalog-layout">
        <aside className="catalog-map-panel">
          <ListingMap items={cards} />
        </aside>
        <div>
          <div className="catalog-grid">
            {cards.map((card) =>
              service ? (
                <ServiceCard key={card.id} service={card} />
              ) : (
                <VenueCard key={card.id} venue={card} />
              ),
            )}
          </div>
          {busy && (
            <p className="api-status" role="status">
              Loading {kind}…
            </p>
          )}
          {!busy && !error && !cards.length && (
            <p className="empty-state">No {kind} match your filters.</p>
          )}
          {error && (
            <p role="alert" className="api-status error-status">
              {error}
            </p>
          )}
          {!busy && (error || (cards.length > 0 && !exhausted.current)) && (
            <button
              type="button"
              className="vf-button load-more"
              onClick={load}
            >
              {error ? "Try again" : "Load more"}
            </button>
          )}
          {!busy && !error && cards.length > 0 && exhausted.current && (
            <p className="catalog-end">
              You’ve reached the end of the results.
            </p>
          )}
          <div ref={sentinel} aria-hidden="true" />
        </div>
      </div>
    </>
  );
}

function normalizedType(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, " ")
    .replace(/s$/, "");
}

export default function CatalogPage({ kind, values }) {
  const service = kind === "services";
  const categories = usePublicData(
    service
      ? "/service-categories/public?limit=100"
      : "/venue-categories/public?limit=100",
  );
  const choices =
    categories.data?.categories ||
    categories.data?.[service ? "serviceCategories" : "venueCategories"] ||
    (Array.isArray(categories.data) ? categories.data : []);
  const path = service ? "/services/list" : "/venues";
  const category =
    values.category ||
    (values.type
      ? choices.find(
          (item) => normalizedType(item.name) === normalizedType(values.type),
        )?._id
      : "");
  const unresolvedType = values.type && !category;
  const filters = useMemo(() => {
    const { search, city, eventType, guests, date, minPrice, maxPrice } =
      values;
    const available =
      /^\d{4}-\d{2}-\d{2}$/.test(date || "") &&
      new Date(date + "T00:00:00+05:30") > new Date();
    return {
      search,
      category,
      minPrice,
      maxPrice,
      ...(!service && {
        city,
        eventType,
        guests,
        ...(available && {
          startAt: date + "T00:00:00+05:30",
          endAt: date + "T23:59:59+05:30",
        }),
      }),
    };
  }, [values, service, category]);
  return (
    <>
      <Header />
      <div className="catalog-search">
        <div className="container">
          <SearchBar
            service={service}
            categories={choices}
            filters={{ ...values, category }}
          />
          <div className="type-chips">
            <Link
              href={hrefWith(path, { ...values, category: "", type: "" })}
              className={`outline-chip ${!category && !values.type ? "active-chip" : ""}`}
            >
              All {kind}
            </Link>
            {choices.map((item) => (
              <Link
                key={item._id}
                className={`outline-chip ${category === item._id ? "active-chip" : ""}`}
                href={hrefWith(path, {
                  ...values,
                  category: item._id,
                  type: "",
                })}
              >
                <i
                  className={`bi ${service ? "bi-stars" : "bi-buildings"}`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <main className="container catalog-content">
        <nav className="breadcrumb-text" aria-label="Breadcrumb">
          <Link href="/">Home</Link> ›{" "}
          {service ? <Link href="/services">Services</Link> : "Venues"}{" "}
          {service && "› Browse services"}
        </nav>
        <form className="catalog-filter" action={path}>
          {Object.entries(values)
            .filter(
              ([key, val]) => val && !["minPrice", "maxPrice"].includes(key),
            )
            .map(([key, val]) => (
              <input key={key} type="hidden" name={key} value={val} />
            ))}
          <label>
            Min price{" "}
            <input
              name="minPrice"
              type="number"
              min="0"
              placeholder="₹ Any"
              defaultValue={values.minPrice}
            />
          </label>
          <label>
            Max price{" "}
            <input
              name="maxPrice"
              type="number"
              min="0"
              placeholder="₹ Any"
              defaultValue={values.maxPrice}
            />
          </label>
          <button className="vf-button outline" type="submit">
            <i className="bi bi-sliders" aria-hidden="true" /> Apply filters
          </button>
        </form>
        {values.date && !filters.startAt && !service && (
          <p className="catalog-caption">
            Choose a future event date to filter availability.
          </p>
        )}
        {unresolvedType && categories.loading && (
          <p role="status">Loading venue types…</p>
        )}
        {unresolvedType && !categories.loading && (
          <p className="empty-state">
            {categories.error
              ? "Venue types could not load."
              : `There is no published category named ${values.type}.`}{" "}
            <Link href="/venues">Browse all venues</Link>
          </p>
        )}
        {!unresolvedType && (
          <PageResults
            key={JSON.stringify(filters)}
            kind={kind}
            filters={filters}
            endpoint={service ? "/services/public" : "/venue/public"}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
