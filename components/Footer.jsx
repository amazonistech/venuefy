import Link from "next/link";
import { company } from "../lib/company";
import { partnerPortal, hrefWith } from "../lib/publicApi";

const places = ["Delhi", "Noida", "Gurugram", "Goa", "Jaipur", "Mumbai", "Pune", "Bengaluru", "Hyderabad", "Udaipur", "Chandigarh", "Shimla"];
const venueTypes = ["Banquet halls", "Wedding lawns", "Farmhouses", "Hotels", "Resorts", "Party venues"];
const legal = [
  ["About Us", "/about-us"], ["Contact Us", "/contact-us"], ["Company Details", "/company-details"],
  ["Terms & Conditions", "/terms-and-conditions"], ["Privacy Policy", "/privacy-policy"],
  ["Cancellation & Refund Policy", "/cancellation-refund-policy"], ["Refund Policy", "/refund-policy"], ["Cookies Policy", "/cookie-policy"],
];
const socials = [
  ["Instagram", "instagram", "https://instagram.com/venuefy.in"],
  ["Facebook", "facebook", "https://facebook.com/venuefy.in"],
  ["YouTube", "youtube", "https://youtube.com/@venuefy"],
  ["LinkedIn", "linkedin", "https://linkedin.com/company/venuefy-official"],
  ["WhatsApp", "whatsapp", "https://wa.me/918796955210"],
];

export default function Footer({ locations = [] }) {
  const cities = locations.length ? locations : places.map((name) => ({ name, href: hrefWith("/venues", { city: name }) }));
  return <footer className="footer vf-footer"><div className="container">
    <section className="footer-explore">
      <h2>Explore popular venues and locations</h2>
      <div className="footer-top-links"><Link href="/venues">Popular</Link><Link href="/venues?eventType=wedding">Wedding venues</Link><Link href="/venues?eventType=corporate">Corporate events</Link><Link href="/services">Event services</Link></div>
      <div className="footer-city-grid">{cities.slice(0, 18).map(({ name, href }) => <Link key={name} href={href}>{name}<small>Explore venues</small></Link>)}</div>
    </section>
    <div className="footer-links">
      <div className="footer-brand">
        <Link href="/"><img src="/images/logo-footer.png" height={74} alt="Venuefy" /></Link>
        <p>Discover venues and event services for celebrations across India.</p>
        <div className="socials">{socials.map(([title, icon, href]) => <a key={title} href={href} aria-label={title} target="_blank" rel="noreferrer"><i className={`bi bi-${icon}`} /></a>)}</div>
        <a href={`mailto:${company.support}`}>{company.support}</a>
        <small>Venuefy app coming soon</small>
        <div className="app-badges">
          <a href="https://apps.apple.com/" target="_blank" rel="noreferrer"><img src="/images/app-store-badge.svg" alt="App Store" /></a>
          <a href="https://play.google.com/store" target="_blank" rel="noreferrer"><img src="/images/google-play-badge.png" alt="Google Play" /></a>
        </div>
      </div>
      <div className="footer-col"><h3>Find venues</h3><Link href="/venues?eventType=wedding">Wedding venues</Link>{venueTypes.map((item) => <Link href={hrefWith("/venues", { type: item })} key={item}>{item}</Link>)}</div>
      <div className="footer-col"><h3>For venue owners</h3><a href={partnerPortal}>List your venue</a><a href={partnerPortal}>Manage your venue</a><a href={partnerPortal}>Partner login</a><Link href="/contact-us">Venue owner support</Link></div>
      <div className="footer-col"><h3>Company &amp; legal</h3>{legal.map(([text, href]) => <Link href={href} key={href}>{text}</Link>)}</div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Venuefy™. Owned and operated by <a href={company.url}>{company.name}</a></span><span><Link href="/privacy-policy">Privacy</Link> · <Link href="/terms-and-conditions">Terms</Link> · English (IN)</span></div>
  </div></footer>;
}
