export default function BookingCard({ price = 0 }) {
  return (
    <div className="booking-card">
      <small>Starting from</small>
      <h2>
        ₹ {Number(price).toLocaleString("en-IN")} <small>/ onwards</small>
      </h2>
      <p>Final pricing may vary based on menu, decor, taxes, and inclusions.</p>
      <div className="booking-tabs">
        <button type="button">Book Event　 <i className="bi bi-calendar-event"></i></button>
        <button type="button">Schedule a Visit</button>
      </div>
      <div className="booking-fields">
        <div>
          Event Date<small>Select date
            <i className="bi bi-calendar-event"></i>
          </small>
        </div>
        <div>
          Guest<small>Select Guest
            <i className="ms-2 bi bi-people"></i>
          </small>
        </div>
      </div>
      <div className="booking-details">
        <b><i className="bi bi-tag"></i> Venue Pricing</b>
        <small>
          Starting Price{" "}
          <strong>₹ {Number(price).toLocaleString("en-IN")}</strong>
        </small>
        <small>
          Location <strong>Available</strong>
        </small>
      </div>
      <button className="pay-btn" type="button">
        Pay Advance & Confirm Booking
        <i className="bi bi-arrow-right"></i>
      </button>
      <small className="booking-note">
        <i className="bi bi-stopwatch me-2"></i>
        Your Date Will Be Tentatively Held For 24 Hours
      </small>
    </div>
  );
}
