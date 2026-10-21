import Link from "next/link";

export default function Header({ variant = "default" }) {
  return (
    <header className={`site-header ${variant === "home" ? "home-header" : ""}`}>
      <div className="container header-inner">
        <Link className="brand" href="/">
          {variant === "home" ? <img src="/images/logo.png" alt="" /> :
            <img src="/images/logo2.png" height={40} alt="" />}
        </Link>
        {variant === "home" ? (
          <nav className="top-nav" aria-label="Main navigation">
            <Link href="/#venue-results">Venues</Link>
            <Link href="/#services">Services</Link>
            <Link className="active" href="https://listing.venuefy.in">List &amp; Manage Your Venue <small>Free</small></Link>
          </nav>
        ) : (
          <div className="header-search">
            <i className="bi bi-geo-alt-fill ms-2" aria-hidden="true" />
            <div style={{ marginLeft: '-5px' }}><b>Where</b><small>Search city, area or venue</small></div>

            <i className="bi bi-calendar-event ms-2" aria-hidden="true" />
            <div style={{ marginLeft: '-5px' }}><b>Event Date</b><small>Select Date</small></div>

            <i className="bi bi-people-fill ms-2" aria-hidden="true" />
            <div style={{ marginLeft: '-5px' }}><b>Guests</b><small>Add guests</small></div>

            <i className="bi bi-grid-fill ms-2" aria-hidden="true" />
            <div style={{ marginLeft: '-5px' }}><b>Event Type</b><small>Choose venue type</small></div>
            <Link className="header-search-button" href="/#venue-results" aria-label="Search venues">
              <i className="bi bi-search search-icon" aria-hidden="true" /></Link>
          </div>
        )}
        <div className="header-actions">
          <Link className="heart-icon fs-5" href="/#venue-results" aria-label="Saved venues"><i className="bi bi-heart" aria-hidden="true" /> Shortlist</Link>
          <Link className="login-btn" href="/#venue-results">SignUp / Login</Link>
        </div>
      </div>
    </header>
  );
}
