import Link from "next/link";

export default function Header({ variant = "default" }) {
  return (
    <header className={`site-header ${variant === "home" ? "home-header" : ""}`}>
      <div className="container header-inner">
        <Link className="brand" href="/">
          <img src="/images/logo-navbar.png" height={40} alt="" />
        </Link>
        {variant === "home" ? (
          <nav className="top-nav" aria-label="Main navigation">
            <Link href="/#venue-results">Venues</Link>
            <Link href="/#services">Services</Link>
            <Link className="active" href="/#venue-results">List &amp; Manage Your Venue <small>Free</small></Link>
          </nav>
        ) : (
          <div className="header-search">
            <span><i className="bi bi-geo-alt-fill" aria-hidden="true" /></span>
            <div><b>Where</b><small>Search city, area or venue</small></div>
            <div><b>Event Date</b><small>Select Date</small></div>
            <div><b>Guests</b><small>Add guests</small></div>
            <div><b>Event Type</b><small>Choose venue type</small></div>
            <Link className="header-search-button" href="/#venue-results" aria-label="Search venues"><i className="bi bi-search" aria-hidden="true" /></Link>
          </div>
        )}
        <div className="header-actions">
          <Link className="heart-icon" href="/#venue-results" aria-label="Saved venues"><i className="bi bi-heart" aria-hidden="true" /></Link>
          <Link className="login-btn" href="/#venue-results">SignUp / Login</Link>
        </div>
      </div>
    </header>
  );
}
