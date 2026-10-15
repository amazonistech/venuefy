import Link from "next/link";
import VenueCard from "./VenueCard";

export default function VenueSection({ title, subtitle, venues = [], viewAllHref = "/#venue-results" }) {
  if (!venues.length) return null;
  return (
    <section className="venue-section">
      <div className="section-title-row">
        <div><h2>{title}</h2><p>{subtitle}</p></div>
        <Link href={viewAllHref}>View all <i className="bi bi-arrow-right" aria-hidden="true" /></Link>
      </div>
      <div className="venue-grid">
        {venues.map((venue) => <VenueCard key={venue.id || venue.slug || venue.name} venue={venue} />)}
      </div>
    </section>
  );
}
