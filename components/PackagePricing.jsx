import { money } from "../lib/publicApi";
import { paise } from "../lib/bookingDisplay";

export function packageRate(venue, item) {
  const method = item.pricingMethod || (venue.isFixedPrice ? "fixed" : "per_plate");
  const rate = money(item.price) + (method === "fixed" ? " / event" : " / plate");
  return method === "combined" ? rate + " + " + money(item.fixedRental ?? 0) + " venue rental" : rate;
}

export function BasePrice({ venue, selected }) {
  if (selected) return <div className="selected-package-rate" aria-live="polite">
    <span>Selected package</span>
    <h2>{selected.name}</h2>
    <strong>{packageRate(venue, selected)}</strong>
  </div>;
  return <div>
    <span>Venue base price</span>
    <h2>{money(venue.price)} {venue.price != null && <small>{venue.isFixedPrice ? "/ event" : "/ plate"}</small>}</h2>
  </div>;
}

export function QuoteBreakdown({ price, totalLabel = "Estimated total" }) {
  return <section className="booking-price-preview" aria-live="polite">
    <h3>Price breakdown</h3>
    <ul className="money-rows">
      {price.lines.map((line, index) => <li key={index}>
        <span>{line.description} <small>{line.quantity} × {paise(line.unitPaise)}{line.type === "catering" ? " / plate" : ""}</small></span>
        <strong>{paise(line.totalPaise)}</strong>
      </li>)}
      <li><span>Subtotal</span><span>{paise(price.subtotalPaise)}</span></li>
      {price.discountPaise > 0 && <li><span>Discount</span><span>−{paise(price.discountPaise)}</span></li>}
      {price.taxPaise > 0 && <li><span>Tax</span><span>{paise(price.taxPaise)}</span></li>}
      <li><strong>{totalLabel}</strong><strong>{paise(price.totalPaise)}</strong></li>
    </ul>
  </section>;
}
