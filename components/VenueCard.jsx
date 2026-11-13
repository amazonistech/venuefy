"use client";

import Link from "next/link";
import { toggleSaved, useSaved } from "./useSaved";

export default function VenueCard({ venue }) {
  const { shortlist = [] } = useSaved();
  const selected = shortlist.some(({ id }) => id === venue.id);
  return (
    <article className="venue-card">
      <div className="card-image">
        <Link href={venue.href} aria-label={venue.name}>
          {venue.image ? (
            <img src={venue.image} alt="" loading="lazy" />
          ) : (
            <i className="bi bi-buildings" aria-hidden="true" />
          )}
        </Link>
        {venue.approved && (
          <span className="verified">
            <i className="bi bi-check-circle-fill" /> Listed
          </span>
        )}
        <button
          type="button"
          className="favorite"
          aria-pressed={selected}
          aria-label={`${selected ? "Remove from shortlist" : "Shortlist"} ${venue.name}`}
          onClick={() => toggleSaved("shortlist", venue)}
        >
          <i
            className={selected ? "bi bi-heart-fill" : "bi bi-heart"}
            aria-hidden="true"
          />
        </button>
      </div>
      <div className="card-body">
        <div className="card-title">
          <Link href={venue.href}>
            <strong>{venue.name}</strong>
          </Link>
          {venue.rating ? (
            <span>
              ★ {venue.rating} {venue.reviews ? `(${venue.reviews})` : ""}
            </span>
          ) : null}
        </div>
        {venue.location && (
          <div className="muted">
            <i className="bi bi-geo-alt" /> {venue.location}
          </div>
        )}
        {venue.guests && (
          <div className="muted">
            <i className="bi bi-people" /> {venue.guests}
          </div>
        )}
        <div className="card-price">
          {venue.price}{" "}
          <small>
            {venue.rawPrice != null
              ? venue.isFixedPrice
                ? "/ event onwards"
                : "/ plate onwards"
              : ""}
          </small>
        </div>
      </div>
    </article>
  );
}
