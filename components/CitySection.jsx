import Link from "next/link";

export default function CitySection({ title, subtitle, cards = [] }) {
  if (!cards.length) return null;
  return (
    <section className="city-section">
      <div className="section-title-row"><div><h2>{title}</h2><p>{subtitle}</p></div></div>
      <div className="city-grid">
        {cards.map((card) => {
          const content = (
            <div className="city-card-content">
              <strong>{card.name}</strong>
              <small>{card.count} <i className="bi bi-arrow-right" aria-hidden="true" /></small>
            </div>
          );
          return card.href ? (
            <Link className="city-card" href={card.href} key={card.name} style={card.image ? { backgroundImage: `linear-gradient(0deg,rgba(3,35,75,.9),transparent 65%),url("${card.image}")` } : undefined}>
              {content}
            </Link>
          ) : (
            <article className="city-card" key={card.name} style={card.image ? { backgroundImage: `linear-gradient(0deg,rgba(3,35,75,.9),transparent 65%),url("${card.image}")` } : undefined}>
              {content}
            </article>
          );
        })}
      </div>
    </section>
  );
}
