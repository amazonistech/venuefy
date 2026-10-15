import Link from "next/link";

export default function VenueCard({ venue }) {
  const content = (
    <article className="venue-card">
      <div
        className="card-image"
        style={{
          backgroundImage: venue.image ? `url(${venue.image})` : undefined,
        }}
      >
        <span className="verified">● approved</span>
        <span className="favorite">♡</span>
      </div>
      <div className="card-body">
        <div className="card-title">
          <strong>{venue.name}</strong>
          <span>
            {venue.rating ? `★ ${venue.rating}` : "New"}{" "}
            {venue.reviews ? <small>({venue.reviews})</small> : null}
          </span>
        </div>
        <div className="muted">⌖ {venue.location}</div>
        <div className="muted">♙ {venue.guests}</div>
        <div className="card-price">
          ₹ {venue.price} <small>/ onwards</small>
        </div>
      </div>
    </article>
  );
  return venue.id ? (
    <Link href={`/venue/${venue.slug || venue.id}`} className="venue-card-link">
      {content}
    </Link>
  ) : (
    content
  );
}
