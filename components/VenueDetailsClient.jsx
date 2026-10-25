"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getVenue,
  getVenueDetails,
} from "../Redux/ActionCreators/VenueActionCreators";
import { mapVenueCard, mapVenueDetails } from "../lib/venueMapper";
import Header from "./Header";
import DetailsGallery from "./DetailsGallery";
import BookingCard from "./BookingCard";
import Footer from "./Footer";
import VenueCard from "./VenueCard";
import { getImageUrl } from "../lib/venueMapper";
import Link from "next/link";

export default function VenueDetailsClient({ id }) {
  const dispatch = useDispatch();
  const {
    items = [],
    selected,
    loading,
    error,
  } = useSelector((state) => state.VenueReducer);

  useEffect(() => {
    if (id) dispatch(getVenueDetails(id));
    dispatch(getVenue({ query: "limit=100" }));
  }, [dispatch, id]);

  const venue = useMemo(() => mapVenueDetails(selected), [selected]);
  const similar = useMemo(
    () =>
      items
        .filter((item) => item._id !== selected?._id)
        .slice(0, 4)
        .map(mapVenueCard),
    [items, selected],
  );

  if (loading && !venue)
    return (
      <>
        <Header />
        <main className="container">
          <div className="page-loader">Loading venue...</div>
        </main>
        <Footer />
      </>
    );
  if (!venue)
    return (
      <>
        <Header />
        <main className="container">
          <div className="empty-state">Venue not found.</div>
          {error && <div className="api-status error-status">{error}</div>}
        </main>
        <Footer />
      </>
    );

  const ratingText = venue.rating
    ? `★ ${venue.rating} (${venue.reviews || 0} reviews)`
    : "No reviews yet";

  return (
    <>
      <Header />
      <main className="details-page">
        <div className="container">
          <div className="breadcrumb-text">
            Home › Venues › {venue.location} › <strong className="text-dark">{venue.name}</strong>
          </div>
          <div className="details-heading-row">
            <div>
              <h1>{venue.name}</h1>
              <div className="rating-line">
                <span>{ratingText}</span> · 📍 {venue.location} ·{" "}
                {venue.category}
              </div>
            </div>
            <div className="action-links">
              <span>⇄ Compare</span>
              <span>⇧ Share</span>
              <span>♡ Save</span>
            </div>
          </div>
          <DetailsGallery venue={venue} />
          <div className="details-columns">
            <div className="details-main">
              {venue.stats.length > 0 && (
                <section className="capacity-strip">
                  {venue.stats.map((stat, i) => (
                    <div key={`${stat.label}-${i}`}>
                      <span className="stat-icon">
                        <span dangerouslySetInnerHTML={{ __html: stat.icon }} />
                      </span>
                      <b>{stat.value}</b>
                      <small>{stat.label}</small>
                    </div>
                  ))}
                </section>
              )}
              <section className="info-card">
                <h3>Overview</h3>
                <p>{venue.overview}</p>
                {venue.highlights.length > 0 && (
                  <>
                    <h3>Venue Highlights</h3>
                    <div className="feature-row">
                      {venue.highlights.map((item) => (
                        <span key={item}>
                          <i className="bi bi-check-circle"></i>
                          {item}
                        </span>
                      ))}
                    </div>
                  </>
                )}
                {venue.amenities.length > 0 && (
                  <>
                    <h3>Amenities &amp; Services</h3>
                    <div className="amenities-grid">
                      {venue.amenities.map((item) => (
                        <span key={item}>
                          <i className="bi bi-check-circle"></i>
                          <small>{item}</small>
                        </span>
                      ))}
                    </div>
                  </>
                )}
                {venue.policies.length > 0 && (
                  <>
                    <h3>Policies &amp; Important information</h3>
                    <div className="amenities-grid policies-grid">
                      {venue.policies.map((item) => (
                        <span key={item}>
                          <i className="bi bi-check-circle"></i>
                          <small>{item}</small>
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </section>
            </div>
            <aside>
              <BookingCard price={venue.price} />

              <div className="booking-card my-3 border-success border-3 rules-div">
                <h5><span className="bullet-check me-4"><i className="bi bi-shield-check text-light"></i></span> Why pay on Venuefy</h5>
                <p className="text-dark"><span className="bullet-check2 me-4"><i className="bi bi-check text-light fs-5"></i></span> Official Venuefy booking confirmation</p>
                <p className="text-dark"><span className="bullet-check2 me-4"><i className="bi bi-check text-light fs-5"></i></span> Whatsapp confirmation from venue owner</p>
                <p className="text-dark"><span className="bullet-check2 me-4"><i className="bi bi-check text-light fs-5"></i></span> Booking and payment record saved</p>
                <p className="text-dark"><span className="bullet-check2 me-4"><i className="bi bi-check text-light fs-5"></i></span> Secure advance payment</p>
                <p className="text-dark"><span className="bullet-check2 me-4"><i className="bi bi-check text-light fs-5"></i></span> Transparent advance & remaining balance</p>
                <p className="text-dark"><span className="bullet-check2 me-4"><i className="bi bi-check text-light fs-5"></i></span> Verified venue partnerers</p>
                <p className="text-dark"><span className="bullet-check2 me-4"><i className="bi bi-check text-light fs-5"></i></span> Direct venue coordination</p>
                <p className="text-dark"><span className="bullet-check2 me-4"><i className="bi bi-check text-light fs-5"></i></span> Dedicated booking support</p>
                <p className="text-dark"><span className="bullet-check2 me-4"><i className="bi bi-check text-light fs-5"></i></span> Cancellation/refund support as per policy</p>
                <p className="text-dark"><span className="bullet-check2 me-4"><i className="bi bi-check text-light fs-5"></i></span> Easy venue visit scheduling</p>
              </div>
              {venue.vendor && (
                <section className="managed-card">
                  <div
                    className="manager-avatar"
                    style={
                      venue.vendor.logo
                        ? {
                          backgroundImage: `url(${getImageUrl(venue.vendor.logo)})`,
                        }
                        : undefined
                    }
                  ></div>
                  <div>
                    <strong>
                      Managed by {venue.vendor.businessName || "Venue Team"}
                    </strong>
                    <small>
                      {venue.vendor.businessType || "Venue Partner"}
                    </small>
                    <b>
                      {venue.vendor?.businessPhone ||
                        venue.vendor?.businessEmail ||
                        "Contact details available on request"}
                    </b>
                  </div>
                  <div className="manager-actions">
                    <Link href={`tel:${venue.vendor?.businessPhone}`} className="text-center"><i className="bi bi-telephone me-2"></i> Call</Link>
                    <Link href={`https://wa.me/${venue.vendor?.businessPhone}`} className="text-center"><i className="bi bi-whatsapp me-2 text-success"></i>Whatsapp</Link>
                    <button type="button"><i className="bi bi-telephone me-2"></i> Request Callback</button>
                  </div>
                </section>
              )}
            </aside>
          </div>
          <section className="map-section">
            <div>
              <h3>Where You'll be</h3>
              <div className="map-placeholder">
                <span>📍 {venue.location}</span>
              </div>
            </div>
            <div className="things-card">
              <h3>Things to know</h3>
              {venue.things.length ? (
                venue.things.map(([key, value]) => (
                  <p key={key}>
                    <b>{key}</b>
                    <span>{value}</span>
                  </p>
                ))
              ) : (
                <p>
                  <span>No additional information has been added.</span>
                </p>
              )}
            </div>
          </section>
          {similar.length > 0 && (
            <section className="similar-section">
              <div className="section-title-row">
                <h2><i className="bi bi-geo-alt-fill text-gold fs-5"></i> Similar Venues Nearby</h2>
              </div>
              <div className="venue-grid">
                {similar.map((item) => (
                  <VenueCard key={item.id} venue={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      {error && <div className="api-loading">{error}</div>}
      <Footer />
    </>
  );
}
