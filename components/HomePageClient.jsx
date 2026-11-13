"use client";

import Link from "next/link";
import Header from "./Header";
import SearchBar from "./SearchBar";
import VenueSection from "./VenueSection";
import CitySection from "./CitySection";
import ServiceSection from "./ServiceSection";
import { useState } from "react";
import Footer from "./Footer";
import usePublicData from "./usePublicData";
import { hrefWith } from "../lib/publicApi";
import { getImageUrl, mapServiceCard, mapVenueCard } from "../lib/venueMapper";

export default function HomePageClient() {
  const [serviceCategory, setServiceCategory] = useState("");
  const services = usePublicData(
    hrefWith("/services/public", { limit: 8, category: serviceCategory }),
  );
  const serviceCategories = usePublicData(
    "/service-categories/public?limit=30",
  );
  const venues = usePublicData("/venue/public?limit=24");
  const cities = usePublicData("/cities/public?limit=18");
  const categories = usePublicData("/venue-categories/public?limit=30");
  const cards = (venues.data?.venues || []).map(mapVenueCard);
  const cityCards = (cities.data?.cities || []).map((city) => ({
    name: city.name,
    image: getImageUrl(city.pic),
    count: "Explore venues",
    href: hrefWith("/venues", { city: city.name }),
  }));
  const types =
    categories.data?.categories || categories.data?.venueCategories || [];
  const destination = types.filter((item) =>
    /destination|resort|palace|farmhouse|outdoor|beach|mountain/i.test(
      item.name,
    ),
  );
  const destinationNames = new Set(destination.map((item) => item.name));
  const destinationVenues = cards.filter((item) =>
    destinationNames.has(item.category),
  );
  const premium = cards
    .filter((item) => item.rawPrice != null)
    .sort((a, b) => b.rawPrice - a.rawPrice);
  const firstCity = cityCards[0]?.name;
  const popular = usePublicData(
    firstCity ? hrefWith("/venue/public", { city: firstCity, limit: 5 }) : null,
  );
  const popularCards = (popular.data?.venues || []).map(mapVenueCard);
  return (
    <>
      <Header variant="home" />
      <main>
        <section className="site-hero">
          <div className="container hero-content">
            <h1>
              Find the perfect venue
              <br /> for your <em>celebration</em>
            </h1>
            <p>
              Discover venues for weddings, parties, corporate events and more.
            </p>
            <SearchBar />
            <div className="hero-cities" aria-label="Popular locations">
              {cityCards.slice(0, 6).map(({ name, href }) => (
                <Link href={href} key={name}>
                  {name}
                </Link>
              ))}
              <Link href="/venues">
                All locations{" "}
                <i className="bi bi-chevron-right" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
        <div className="container home-sections">
          <section>
            <h2>Explore by venue type</h2>
            <div className="type-chips">
              <Link className="outline-chip active-chip" href="/venues">
                <i className="bi bi-sliders" /> All venues
              </Link>
              {types.map((item) => (
                <Link
                  className="outline-chip"
                  key={item._id}
                  href={hrefWith("/venues", { category: item._id })}
                >
                  <i className="bi bi-buildings" /> {item.name}
                </Link>
              ))}
            </div>
          </section>
          {venues.loading && (
            <p role="status" className="api-status">
              Loading venues…
            </p>
          )}
          {venues.error && (
            <p className="api-status error-status">{venues.error.message}</p>
          )}
          {!venues.loading && !venues.error && !cards.length && (
            <p className="empty-state">
              Venue listings will appear here as they’re published.
            </p>
          )}
          <VenueSection
            title="Discover venues"
            subtitle="Find a setting for your next celebration"
            venues={cards.slice(0, 5)}
            viewAllHref="/venues"
          />
          <VenueSection
            title="Destination weddings in India"
            subtitle="Find a setting for your wedding away from home"
            venues={destinationVenues.slice(0, 5)}
            viewAllHref="/venues?eventType=wedding"
          />
          <VenueSection
            title="Explore premium venues"
            subtitle="Browse higher-priced venues from current listings"
            venues={premium.slice(0, 5)}
            viewAllHref="/venues"
          />
          {cards.some((item) => item.rating) && (
            <VenueSection
              title="Top rated venues"
              subtitle="Based on published guest reviews"
              venues={cards
                .filter((item) => item.rating)
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 5)}
              viewAllHref="/venues"
            />
          )}
          {firstCity && (
            <VenueSection
              title={`Explore venues in ${firstCity}`}
              subtitle="Discover spaces in this city"
              venues={popularCards}
              viewAllHref={hrefWith("/venues", { city: firstCity })}
            />
          )}
          <CitySection
            title="Explore by city"
            subtitle="Discover venues across India"
            cards={cityCards.slice(0, 5)}
          />
          <CitySection
            title="Destination weddings"
            subtitle="Explore venues by the setting you love"
            cards={destination
              .slice(0, 5)
              .map((item) => ({
                name: item.name,
                count: "Explore venues",
                image: getImageUrl(item.image),
                href: hrefWith("/venues", { category: item._id }),
              }))}
          />
          <ServiceSection
            services={(services.data?.services || []).map(mapServiceCard)}
            categories={
              serviceCategories.data?.categories ||
              serviceCategories.data?.serviceCategories ||
              []
            }
            selectedCategory={serviceCategory}
            onCategoryChange={setServiceCategory}
            loading={services.loading}
            error={services.error?.message}
          />
          <section className="wedding-campaign">
            <span className="vf-kicker">Plan your wedding</span>
            <h2 className="campaign-headline">
              A setting worthy of your story
            </h2>
            <Link className="vf-button" href="/venues?eventType=wedding">
              Explore wedding venues <i className="bi bi-arrow-right" />
            </Link>
          </section>
        </div>
      </main>
      <Footer locations={cityCards} />
    </>
  );
}
