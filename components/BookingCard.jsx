export default function BookingCard({ price = 0 }) {
  return (
    <div className="booking-card">
      <small>Starting from</small>
      <h2>
        ₹ {Number(price).toLocaleString("en-IN")} <small>/ onwards</small>
      </h2>
      <p>Final pricing may vary based on menu, decor, taxes, and inclusions.</p>
      <div className="booking-tabs">
        <button type="button">Book Event　▣</button>
        <button type="button">Schedule a Visit</button>
      </div>
      <div className="booking-fields">
        <div>
          Event Date<small>Select date　▣</small>
        </div>
        <div>
          Guest<small>Select Guest　♙</small>
        </div>
      </div>
      <div className="booking-details">
        <b>◇ Venue Pricing</b>
        <small>
          Starting Price{" "}
          <strong>₹ {Number(price).toLocaleString("en-IN")}</strong>
        </small>
        <small>
          Location <strong>Available</strong>
        </small>
      </div>
      <button className="pay-btn" type="button">
        Request Availability →
      </button>
      <small className="booking-note">
        Booking functionality will be connected when the booking API is
        available.
      </small>
    </div>
  );
}
