import Link from "next/link";
import RichText from "./RichText";
import { hrefWith } from "../lib/publicApi";

export default function ServiceCard({ service }) {
  return (
    <article className="service-card">
      <div className="service-card-image">
        {service.imageUrl ? (
          <img src={service.imageUrl} alt={service.name} loading="lazy" />
        ) : (
          <i className="bi bi-stars" aria-hidden="true" />
        )}
      </div>
      <div className="service-card-body">
        <div className="service-category-label">
          {service.categoryName || "Wedding service"}
        </div>
        <h3>{service.name}</h3>
        <p>
          <i className="bi bi-geo-alt" aria-hidden="true" />{" "}
          {service.location || "Location not specified"}
        </p>
        <RichText
          value={service.description}
          plain
          className="service-description"
        />
        <strong>
          {service.price} <small>onwards</small>
        </strong>
        <Link
          className="service-card-link"
          href={`/services/${encodeURIComponent(service.id)}/book`}
        >
          Request booking{" "}
          <i className="bi bi-arrow-up-right" aria-hidden="true" />
        </Link>
        {service.categoryId && (
          <Link
            className="service-card-link service-category-link"
            href={hrefWith("/services/list", { category: service.categoryId })}
          >
            More in this category
          </Link>
        )}
      </div>
    </article>
  );
}
