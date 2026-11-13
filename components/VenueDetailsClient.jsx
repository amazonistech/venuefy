"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import DetailsGallery from "./DetailsGallery";
import VenueSection from "./VenueSection";
import ListingMap from "./ListingMap";
import SearchBar from "./SearchBar";
import RichText from "./RichText";
import usePublicData from "./usePublicData";
import { useSaved, toggleSaved } from "./useSaved";
import { hrefWith } from "../lib/publicApi";
import { amenityIcon } from "../lib/amenityIcons";
import { asIndiaInput, earliestVenueStart, paise, indiaTime } from "../lib/bookingDisplay";
import { BasePrice, packageRate } from "./PackagePricing";
import { getImageUrl, mapVenueCard, mapVenueDetails } from "../lib/venueMapper";

function VenueActions({ venue }) {
  const saved = useSaved();
  const [message, setMessage] = useState("");
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: venue.name, url: new URL(venue.href, location.origin).href });
      else { await navigator.clipboard.writeText(new URL(venue.href, location.origin).href); setMessage("Link copied."); }
    } catch (error) { if (error.name !== "AbortError") setMessage("Copy the link from your address bar to share."); }
  }
  return <div className="venue-actions">
    <button type="button" onClick={() => setMessage(toggleSaved("compare", mapVenueCard(venue.record)))} aria-pressed={saved.compare?.some((item) => item.id === venue.id)}><i className="bi bi-layout-split" /> Compare</button>
    <button type="button" onClick={share}><i className="bi bi-share" /> Share</button>
    <button type="button" onClick={() => setMessage(toggleSaved("shortlist", mapVenueCard(venue.record)))} aria-pressed={saved.shortlist?.some((item) => item.id === venue.id)}><i className="bi bi-heart" /> Save</button>
    {message && <small role="status">{message}</small>}
  </div>;
}

const bookingBenefits = [
  "Official Venuefy booking confirmation",
  "WhatsApp confirmation from venue owner",
  "Booking and payment record saved",
  "Secure advance payment",
  "Transparent advance & remaining balance",
  "Verified venue partners",
  "Direct venue coordination",
  "Dedicated booking support",
  "Cancellation/refund support as per policy",
  "Easy venue visit scheduling",
];

function BookingBenefits() {
  return <section className="vf-panel booking-trust">
    <h2><i className="ri-shield-check-fill" aria-hidden="true" /> Why pay on Venuefy</h2>
    <ul>{bookingBenefits.map((benefit) => <li key={benefit}>
      <i className="ri-checkbox-circle-fill" aria-hidden="true" /> {benefit}
    </li>)}</ul>
  </section>;
}

function VenueBookingCard({ venue }) {
  const data = venue.record;
  const packages = data.packages || [];
  const [packageId, setPackage] = useState("");
  const [guests, setGuests] = useState("");
  const [start, setStart] = useState("");
  const [now] = useState(Date.now);
  const selected = packages.find((item) => item._id === packageId);
  const method = selected?.pricingMethod || (data.isFixedPrice ? "fixed" : "per_plate");
  const count = Number(guests);
  const minGuests = selected?.minGuests ?? data.minGuests ?? 1;
  const maxGuests = selected?.maxGuests ?? data.maxGuests ?? 1000000;
  const validGuests = Number.isInteger(count) && count >= minGuests && count <= maxGuests;
  const estimate = selected && (method === "fixed" || validGuests)
    ? Math.round(selected.price * 100) * (method === "fixed" ? 1 : count)
      + (method === "combined" ? Math.round((selected.fixedRental || 0) * 100) : 0)
    : null;
  const visitLink = hrefWith(venue.href + "/enquire", { type: "visit" });
  return <section className="vf-panel booking-summary">
    <BasePrice venue={data} selected={selected} />
    <div className="venue-booking-tabs">
      {packages.length > 0 && <span><i className="ri-calendar-check-line" aria-hidden="true" /> Book event</span>}
      <Link href={visitLink}>Schedule a visit</Link>
    </div>
    {packages.length > 0 && <form className="vf-form" action={venue.href + "/book"}>
      <div className="vf-field-grid venue-booking-fields">
        <label><i className="ri-calendar-line" aria-hidden="true" /> Event start (IST)<input type="datetime-local" name="start" min={asIndiaInput(earliestVenueStart(data, selected, now), Math.ceil)} value={start} onChange={(event) => setStart(event.target.value)} /></label>
        <label><i className="ri-group-line" aria-hidden="true" /> Guests<input type="number" name="guests" placeholder="Add guests" min={minGuests} max={maxGuests} value={guests} onChange={(event) => setGuests(event.target.value)} /></label>
      </div>
      <label>Event package<select name="package" value={packageId} onChange={(event) => setPackage(event.target.value)}>
        <option value="">Choose a package</option>
        {packages.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
      </select></label>
      <section className="venue-booking-cost" aria-live="polite">
        <h3><i className="ri-price-tag-3-line" aria-hidden="true" /> Booking details</h3>
        <dl>
          
          {estimate != null && <div><dt>Estimated package total</dt><dd><strong>{paise(estimate)}</strong></dd></div>}
        </dl>
        <small>{selected && method !== "fixed" && !validGuests ? "Enter a guest count to estimate the package total. " : ""}Final price and advance appear after venue approval.</small>
      </section>
      <button className="vf-button">Continue to booking <i className="bi bi-arrow-right" aria-hidden="true" /></button>
    </form>}
  </section>;
}

function VenueTeam({ venue }) {
  const { vendor, createdAt } = venue.record;
  const avatar = getImageUrl(vendor?.logo) || venue.image;
  const phone = vendor?.businessPhone?.replace(/[^+0-9]/g, "");
  const digits = phone?.replace(/\D/g, "");
  const whatsapp = digits?.length === 10 ? "91" + digits : digits;
  return <section className="vf-panel venue-team">
    <div className="venue-team-info">
      {avatar && <img src={avatar} alt="" loading="lazy" />}
      <div>
        <h2>Managed by {vendor?.businessName || "the venue team"}</h2>
        {createdAt && <small>Listed {indiaTime(createdAt).split(",")[0]}</small>}
      </div>
    </div>
    {digits?.length >= 10 && <div className="venue-team-actions">
      <a className="vf-button outline" href={"tel:" + phone}><i className="bi bi-telephone" aria-hidden="true" /> Call</a>
      <a className="vf-button outline" href={"https://wa.me/" + whatsapp} target="_blank" rel="noreferrer"><i className="bi bi-whatsapp" aria-hidden="true" /> WhatsApp</a>
    </div>}
    <Link className="vf-button" href={hrefWith("/contact-us", { subject: "Request a callback about " + venue.name })}>Request a callback</Link>
    <Link className="venue-team-enquiry" href={venue.href + "/enquire"}>Send a venue enquiry</Link>
  </section>;
}

function ReviewList({ id, summary }) {
  const reviews = usePublicData(`/reviews/public/${id}?limit=6`);
  return <section className="vf-panel">
    <h2>Ratings &amp; reviews</h2>
    {summary?.reviewCount > 0 && <p className="review-average">★ {summary.averageRating} <span>from {summary.reviewCount} verified reviews</span></p>}
    {reviews.loading && <p role="status">Loading reviews…</p>}
    {reviews.error && <p role="alert">Reviews could not load.</p>}
    {!reviews.loading && !reviews.error && !reviews.data?.reviews?.length && <p>No published reviews yet.</p>}
    {reviews.data?.reviews?.map((row) => <article className="guest-review" key={row._id}><strong>{row.authorName}</strong><span>★ {row.rating}</span><h3>{row.title}</h3><p>{row.comment}</p>{row.reply?.text && <blockquote><strong>Venue reply</strong><p>{row.reply.text}</p></blockquote>}</article>)}
    <Link href="/bookings">Manage reviews from completed bookings</Link>
  </section>;
}

export default function VenueDetailsClient({ id, tour = false }) {
  const resource = usePublicData(`/venue/public/${encodeURIComponent(id)}`);
  const venue = resource.data ? mapVenueDetails(resource.data) : null;
  const nearby = usePublicData(!tour && venue?.city ? hrefWith("/venue/public", { city: venue.city, limit: 5 }) : null);
  if (!venue) return <><Header /><main className="container home-sections">
    {resource.loading ? <p role="status">Loading venue…</p> : <div className="empty-state"><p>{resource.error?.status === 404 ? "This venue is unavailable." : resource.error?.message || "This venue is unavailable."}</p><Link href="/venues">Browse venues</Link></div>}
  </main><Footer /></>;
  const data = venue.record;
  const policy = data.bookingPolicies || {};
  const things = [...(data.thingsToKnow || []).map((item) => [item.key, item.value]),
    ["Cancellation", policy.cancellationPolicy], ["Payment terms", policy.paymentTerms], ["Check-in", policy.checkInTime], ["Check-out", policy.checkOutTime],
    ["Outside food", typeof policy.outsideFoodAllowed === "boolean" ? (policy.outsideFoodAllowed ? "Allowed" : "Not allowed") : ""],
    ["Alcohol", typeof policy.alcoholAllowed === "boolean" ? (policy.alcoholAllowed ? "Allowed" : "Not allowed") : ""],
  ].filter(([, value]) => value);
  const policies = [...new Set([
    ...(data.policies || []),
    typeof policy.outsideFoodAllowed === "boolean" ? "Outside catering " + (policy.outsideFoodAllowed ? "allowed" : "not allowed") : "",
    typeof policy.alcoholAllowed === "boolean" ? "Alcohol " + (policy.alcoholAllowed ? "allowed" : "not allowed") : "",
    policy.noiseRestriction,
  ].filter(Boolean))];
  const similar = (nearby.data?.venues || []).filter((item) => item._id !== venue.id).slice(0, 4).map(mapVenueCard);
  return <><Header />
    <div className="container service-finder"><SearchBar /></div>
    <main className="container venue-detail">
      <nav className="breadcrumb-text" aria-label="Breadcrumb"><Link href="/">Home</Link> › <Link href="/venues">Venues</Link> › {tour ? <><Link href={venue.href}>{venue.name}</Link> › Photos</> : venue.name}</nav>
      <div className="venue-detail-head"><div><h1>{tour ? "Photo tour" : venue.name}</h1><p>{tour ? venue.name : <>{venue.rating ? `★ ${venue.rating} (${venue.reviews} reviews) · ` : ""}{venue.location} · {venue.category}</>}</p></div><VenueActions venue={venue} /></div>
      <DetailsGallery venue={venue} tour={tour} />
      {!tour && <>
        <div className="venue-facts"><div><i className="bi bi-people" /> {venue.guests || "Capacity on request"}</div><div><i className="bi bi-buildings" /> {data.spaces?.length || "Venue"} {data.spaces?.length ? "event spaces" : ""}</div><div><i className="bi bi-tag" /> {venue.price} onwards</div></div>
        <div className="venue-detail-layout">
          <div>
            <section className="vf-panel venue-overview">
              <h2>Overview</h2><RichText value={data.shortDescription || data.overview || "Contact the venue for more details."} />
              {data.overview && data.shortDescription && data.overview !== data.shortDescription && <RichText value={data.overview} />}
              {data.venueHighlights?.length > 0 && <><h3>Venue highlights</h3><div className="feature-tags">{data.venueHighlights.map((item, i) => <span key={i}><i className="bi bi-star" /> {item}</span>)}</div></>}
              {data.amenitiesAndServices?.length > 0 && <><h3>Amenities &amp; services</h3><ul className="venue-amenities-grid">{data.amenitiesAndServices.map((item, i) => <li key={i}><i className={`ri-${amenityIcon(item)}`} aria-hidden="true" /><span>{item}</span></li>)}</ul></>}
              {policies.length > 0 && <><h3>Policies &amp; important information</h3><ul className="venue-amenities-grid">{policies.map((item) => <li key={item}><i className="ri-information-line" aria-hidden="true" /><span>{item}</span></li>)}</ul></>}
              {data.spaces?.length > 0 && <><h3>Event spaces</h3><div className="feature-tags">{data.spaces.map((space) => <span key={space._id}><i className="bi bi-building" /> {space.name}{space.seatingCapacity ? ` · ${space.seatingCapacity} seated` : ""}</span>)}</div></>}
              {data.packages?.length > 0 && <><h3>Packages</h3><div className="feature-tags">{data.packages.map((item) => <span key={item._id}><i className="bi bi-tag" /> {item.name} · {packageRate(data, item)}</span>)}</div></>}
            </section>
            <ReviewList id={venue.id} summary={data.reviewSummary} />
            <section className="vf-panel detail-map"><h2>Where you’ll be</h2><p>{data.location || venue.location}</p><ListingMap items={[venue]} /></section>
          </div>
          <aside>
            <VenueBookingCard key={venue.id} venue={venue} />
            <BookingBenefits />
            <VenueTeam venue={venue} />
            {things.length > 0 && <section className="vf-panel"><h2>Things to know</h2><dl className="venue-policies">{things.map(([name, text], index) => <div key={index}><dt>{name}</dt><dd>{text}</dd></div>)}</dl></section>}
          </aside>
        </div>
        <VenueSection title="Similar venues nearby" venues={similar} viewAllHref={hrefWith("/venues", { city: venue.city })} />
      </>}
    </main>
    <Footer />
  </>;
}
