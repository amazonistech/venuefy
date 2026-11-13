import Link from "next/link";
import CustomerNav from "./CustomerNav";
import { partnerPortal } from "../lib/publicApi";

export default function Header({ variant = "default" }) {
  const home = variant === "home";
  return (
    <header className={`site-header ${home ? "home-header" : ""}`}>
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label="Venuefy home">
          <img src={home ? "/images/logo.png" : "/images/logo2.png"} alt="Venuefy" />
        </Link>
        <nav className="top-nav" aria-label="Main navigation">
          <Link href="/venues">Venues</Link>
          <Link href="/services">Services</Link>
          <a className="active partner-nav" href={partnerPortal}>List &amp; Manage Your Venue <small>Free</small></a>
        </nav>
        <div className="header-actions">
          <Link href="/compare" aria-label="Compare venues"><i className="bi bi-layout-split" aria-hidden="true" /> <span>Compare</span></Link>
          <Link href="/shortlist" aria-label="Shortlisted venues"><i className="bi bi-heart" aria-hidden="true" /> <span>Shortlist</span></Link>
          <CustomerNav />
        </div>
      </div>
    </header>
  );
}
