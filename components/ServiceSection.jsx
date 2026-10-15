import Link from "next/link";
import ServiceCard from "./ServiceCard";

export default function ServiceSection({ services = [], categories = [], selectedCategory = "", onCategoryChange, loading, error }) {
  return (
    <section className="service-section" id="services">
      <div className="section-title-row">
        <div>
          <h2>Wedding Services</h2>
          <p>Explore services listed by Venufy partners</p>
        </div>
        <Link href="/#services">Explore services <i className="bi bi-arrow-right" aria-hidden="true" /></Link>
      </div>
      {categories.length > 0 && (
        <div className="service-category-chips" aria-label="Filter services by category">
          <button type="button" className={!selectedCategory ? "active" : ""} onClick={() => onCategoryChange("")}>All services</button>
          {categories.map((category) => (
            <button type="button" key={category._id} className={selectedCategory === category._id ? "active" : ""} onClick={() => onCategoryChange(category._id)}>
              {category.name}
            </button>
          ))}
        </div>
      )}
      {loading && <p className="api-status">Loading services...</p>}
      {error && <p className="api-status error-status">{error}</p>}
      {!loading && !services.length && !error && <div className="empty-state">No active services are available yet.</div>}
      {services.length > 0 && <div className="service-grid">{services.slice(0, 8).map((service) => <ServiceCard key={service.id} service={service} />)}</div>}
    </section>
  );
}
