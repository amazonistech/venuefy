import Link from "next/link";

function formatPrice(value) {
  const price = Number(value);
  return Number.isFinite(price) ? price.toLocaleString("en-IN") : "Contact for price";
}

export default function ServiceCard({ service }) {
  const image = service.imageUrl;
  return (
    <article className="service-card">
      <div className="service-card-image" style={image ? { backgroundImage: `url("${image}")` } : undefined}>
        {!image && <i className="bi bi-stars" aria-hidden="true" />}
      </div>
      <div className="service-card-body">
        <div className="service-category-label">{service.categoryName || "Wedding service"}</div>
        <h3>{service.name}</h3>
        <p><i className="bi bi-geo-alt" aria-hidden="true" /> {service.location || "Location not specified"}</p>
        {service.description && <p className="service-description">{service.description}</p>}
        <strong>₹{formatPrice(service.price)} <small>onwards</small></strong>
        <Link href={service.categoryId ? `/?serviceCategory=${encodeURIComponent(service.categoryId)}#services` : "/#services"} className="service-card-link">More in this category <i className="bi bi-arrow-up-right" aria-hidden="true" /></Link>
      </div>
    </article>
  );
}
