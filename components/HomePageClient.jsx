"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import HeroSearch from "./HeroSearch";
import VenueSection from "./VenueSection";
import CitySection from "./CitySection";
import ServiceSection from "./ServiceSection";
import Footer from "./Footer";
import { getVenue } from "../Redux/ActionCreators/VenueActionCreators";
import { getVenueCategory } from "../Redux/ActionCreators/VenueCategoryActionCreators";
import { getService } from "../Redux/ActionCreators/ServiceActionCreators";
import { getServiceCategory } from "../Redux/ActionCreators/ServiceCategoryActionCreators";
import { getImageUrl, mapVenueCard, mapServiceCard } from "../lib/venueMapper";

function buildQuery(values = {}) {
  const params = new URLSearchParams({ page: "1", limit: "100" });
  if (values.search?.trim()) params.set("search", values.search.trim());
  if (values.category) params.set("category", values.category);
  return params.toString();
}

export default function HomePageClient() {
  const dispatch = useDispatch();
  const { items: venueItems = [], loading, error } = useSelector((state) => state.VenueReducer);
  const { items: venueCategories = [], loading: categoryLoading, error: categoryError } = useSelector((state) => state.VenueCategoryReducer);
  const { items: serviceItems = [], loading: serviceLoading, error: serviceError } = useSelector((state) => state.ServiceReducer);
  const { items: serviceCategories = [], loading: serviceCategoryLoading, error: serviceCategoryError } = useSelector((state) => state.ServiceCategoryReducer);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [guests, setGuests] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ search: "", category: "" });
  const [serviceCategory, setServiceCategory] = useState("");

  useEffect(() => {
    dispatch(getVenueCategory({ query: "limit=100" }));
    dispatch(getServiceCategory({ query: "limit=100" }));
    const params = new URLSearchParams(window.location.search);
    const initialSearch = params.get("search") || "";
    const initialCategory = params.get("category") || "";
    const initialServiceCategory = params.get("serviceCategory") || "";
    if (initialServiceCategory) setServiceCategory(initialServiceCategory);
    if (initialSearch || initialCategory) {
      setSearch(initialSearch);
      setCategory(initialCategory);
      setAppliedFilters({ search: initialSearch, category: initialCategory });
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(getVenue({ query: buildQuery(appliedFilters) }));
  }, [dispatch, appliedFilters]);

  useEffect(() => {
    const params = new URLSearchParams({ page: "1", limit: "100" });
    if (appliedFilters.search?.trim()) params.set("search", appliedFilters.search.trim());
    if (serviceCategory) params.set("category", serviceCategory);
    dispatch(getService({ query: params.toString() }));
  }, [dispatch, appliedFilters.search, serviceCategory]);

  const handleSearch = useCallback((searchOverride) => {
    const value = typeof searchOverride === "string" ? searchOverride : search;
    setSearch(value);
    setAppliedFilters({ search: value.trim(), category });
    if (typeof document !== "undefined") {
      window.setTimeout(() => document.getElementById("venue-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    }
  }, [search, category]);

  const handleVenueCategory = (value) => {
    setCategory(value);
    setAppliedFilters((current) => ({ ...current, category: value }));
  };

  const venues = useMemo(() => venueItems.map(mapVenueCard), [venueItems]);
  const services = useMemo(() => serviceItems.map(mapServiceCard), [serviceItems]);
  const uniqueLocations = useMemo(() => {
    const locationCounts = new Map();
    venueItems.forEach((venue) => {
      const location = venue.location?.trim();
      if (location) locationCounts.set(location, (locationCounts.get(location) || 0) + 1);
    });
    return [...locationCounts.entries()].sort((a, b) => b[1] - a[1]);
  }, [venueItems]);

  const premium = useMemo(() => [...venues].sort((a, b) => b.rawPrice - a.rawPrice), [venues]);
  const popularLocation = uniqueLocations[0]?.[0];
  const popularInCity = popularLocation ? venues.filter((venue) => venue.location === popularLocation) : [];
  const weddingCategories = venueCategories.filter((item) => /wedding|destination|banquet|resort|hotel/i.test(item.name || ""));
  const destinationVenues = weddingCategories.length
    ? venues.filter((venue) => weddingCategories.some((categoryItem) => categoryItem.name === venue.category))
    : venues;

  const cityCards = uniqueLocations.slice(0, 5).map(([name, count]) => ({
    name,
    count: `${count} venue${count === 1 ? "" : "s"}`,
    href: `/?search=${encodeURIComponent(name)}#venue-results`,
  }));
  const destinationCards = venueCategories.slice(0, 5).map((item) => ({
    name: item.name,
    count: "Explore venues",
    image: getImageUrl(item.image),
    href: `/?category=${encodeURIComponent(item._id)}#venue-results`,
  }));
  const exploreLocations = uniqueLocations.slice(0, 12);

  return (
    <>
      <Header variant="home" />
      <main>
        <HeroSearch
          search={search}
          setSearch={setSearch}
          categories={venueCategories}
          category={category}
          setCategory={setCategory}
          locations={uniqueLocations.map(([name]) => name)}
          eventDate={eventDate}
          setEventDate={setEventDate}
          guests={guests}
          setGuests={setGuests}
          onSearch={handleSearch}
        />
        <div className="container py-4" id="venue-results">
          <section className="venue-type-row mb-4">
            <div className="section-title-row mb-2">
              <div><h2>Explore by Venue type</h2></div>
              <button className="instant-btn" type="button" onClick={() => handleVenueCategory("")}>
                <i className="bi bi-lightning-charge-fill" aria-hidden="true" /> All available venues
              </button>
            </div>
            <div className="type-chips">
              <button className={`outline-chip ${!category ? "active-chip" : ""}`} type="button" onClick={() => handleVenueCategory("")}>
                <i className="bi bi-sliders2" aria-hidden="true" /> All
              </button>
              {venueCategories.map((item) => (
                <button className={`outline-chip ${category === item._id ? "active-chip" : ""}`} type="button" key={item._id} onClick={() => handleVenueCategory(item._id)}>
                  <span dangerouslySetInnerHTML={{ __html: item.icon }} /> {item.name}
                </button>
              ))}
              {categoryLoading && <span className="small-muted">Loading venue categories...</span>}
              {categoryError && <span className="small-muted error-text">{categoryError}</span>}
            </div>
          </section>

          {loading && <div className="api-status"><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />Loading venues...</div>}
          {error && <div className="api-status error-status">Could not load venues: {error}</div>}
          {!loading && !error && venues.length === 0 && <div className="empty-state">No approved venues match these filters. Try another search or select All.</div>}

          {venues.length > 0 && (
            <>
              <VenueSection title="Top Location Near You" subtitle="Venues currently available in the database" venues={venues.slice(0, 5)} viewAllHref="/#venue-results" />
              <VenueSection title="Destination Wedding in India" subtitle="Explore venues matching destination and wedding categories" venues={destinationVenues.slice(0, 5)} viewAllHref="/#venue-results" />
              <VenueSection title="Premium Venue" subtitle="Available venues sorted by listed price" venues={premium.slice(0, 5)} viewAllHref="/#venue-results" />
              <VenueSection title={popularLocation ? `Popular in ${popularLocation}` : "Popular Venues"} subtitle="Based on the most represented location in the returned venue data" venues={popularInCity.slice(0, 5)} viewAllHref="/#venue-results" />
            </>
          )}

          {cityCards.length > 0 && <CitySection title="Explore City" subtitle="Discover venues across available locations" cards={cityCards} />}
          {destinationCards.length > 0 && <CitySection title="Explore by Venue Category" subtitle="Venue categories fetched from the backend" cards={destinationCards} />}

          <ServiceSection
            services={services}
            categories={serviceCategories}
            selectedCategory={serviceCategory}
            onCategoryChange={setServiceCategory}
            loading={serviceLoading || serviceCategoryLoading}
            error={serviceError || serviceCategoryError}
          />

          {exploreLocations.length > 0 && (
            <section className="explore-links-section">
              <div className="container">
                <h2>Explore Popular Venue &amp; Location</h2>
                <div className="explore-tabs"><span className="active">Locations</span><span>Venues</span></div>
                <div className="explore-grid">
                  {exploreLocations.map(([location, count]) => (
                    <button className="explore-location-link" key={location} type="button" onClick={() => handleSearch(location)}>
                      <strong>{location}</strong><span>{count} venue{count === 1 ? "" : "s"}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
