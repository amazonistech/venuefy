import Link from "next/link";

const footerSections = [
  {
    title: "Find Venues",
    items: [
      ["Wedding Venue", "/venues/wedding-venue"],
      ["Banquet Halls", "/venues/banquet-halls"],
      ["Farmhouses", "/venues/farmhouses"],
      ["Wedding Lawns", "/venues/wedding-lawns"],
      ["Hotels", "/venues/hotels"],
      ["Resorts", "/venues/resorts"],
      ["Party Venue", "/venues/party-venues"],
    ],
  },
  {
    title: "Popular Locations",
    items: [
      ["Wedding Venue in Delhi", "/venues/delhi"],
      ["Wedding Venue in Gurgaon", "/venues/gurgaon"],
      ["Wedding Venue in Noida", "/venues/noida"],
      ["Wedding Venue in Chattarpur", "/venues/chattarpur"],
      ["Wedding Venue in Dwarka", "/venues/dwarka"],
      ["Wedding Venue in Rohini", "/venues/rohini"],
      ["Wedding Venue in Mayur Vihar", "/venues/mayur-vihar"],
    ],
  },
  {
    title: "For Venue Owners",
    items: [
      ["List Your Venue", "/list-your-venue"],
      ["Manage Your Venue", "/venue-owner/dashboard"],
      ["Partner Login", "/login"],
      ["Free Venue Management Tools", "/venue-management-tools"],
      ["Venue Owner Support", "/contact-us"],
    ],
  },
  {
    title: "Company & Legal",
    items: [
      ["About Us", "/about-us"],
      ["Contact Us", "/contact-us"],
      ["Terms & Conditions", "/terms-and-conditions"],
      ["Refund Policy", "/refund-policy"],
      ["Cancellation & Refund Policy", "/cancellation-refund-policy"],
      ["Privacy Policy", "/privacy-policy"],
      ["Cookies Policy", "/cookie-policy"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-links">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
            <img src="/images/logo-footer.png" height={80} alt="" />
            </Link>
            <p>Discover and book verified venues for<br />weddings, parties, corporate events<br />and more across India.</p>
            <b>Follow Us</b>
            <div className="socials">
              <a href="https://facebook.com/venuefy.in" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="bi bi-facebook me-2"></i>
              </a>
              <a href="https://linkedin.com/company/venuefy-official" target="_blank" rel="noopener noreferrer" aria-label="Linkedin">
                <i className="bi bi-linkedin me-2"></i>
              </a>
              <a href="https://x.com/venuefyofficial" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="bi bi-twitter me-2"></i>
              </a>
              <a href="https://instagram.com/venuefy.in" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="bi bi-instagram me-2"></i>
              </a>
              <a href="https://threads.com/@venuefy.in" target="_blank" rel="noopener noreferrer" aria-label="Thread">
                <i className="bi bi-threads me-2"></i>
              </a>
              <a href="https://youtube.com/@venuefy" target="_blank" rel="noopener noreferrer" aria-label="Youtube">
                <i className="bi bi-youtube me-2"></i>
              </a>
              <a href="https://in.pinterest.com/Venuefy" target="_blank" rel="noopener noreferrer" aria-label="PintRest">
                <i className="bi bi-pintrest me-2"></i>
              </a>
              <a href="https://wa.me/+918796955210" target="_blank" rel="noopener noreferrer" aria-label="Whatsapp">
                <i className="bi bi-whatsapp me-2"></i>
              </a>

            </div>
            <small>Coming Soon — Download the Venufy App</small>
            <div className="app-store-badges">
              <a
                href="https://apps.apple.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download on the App Store"
              >
                <img
                  src="/images/app-store-badge.svg"
                  alt="Download on the App Store"
                />
              </a>

              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get it on Google Play"
              >
                <img
                  src="/images/google-play-badge.png"
                  alt="Get it on Google Play"
                />
              </a>
            </div>
          </div>

          {footerSections.map((section) => (
            <FooterCol key={section.title} title={section.title} items={section.items} />
          ))}
        </div>

        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} Venufy™ · All Rights Reserved. Owned &amp; operated by Amazonis IT Services Pvt. Ltd.</div>
          <span className="footer-bottom-legal">
            <Link href="/privacy-policy">Privacy</Link>
            <span> · </span>
            <Link href="/terms-and-conditions">Terms</Link>
            <span> · </span>
            <Link href="/sitemap.xml">Sitemap</Link>
            <span> · </span>
            <Link href="/company-details">Company Details</Link>
            <span> · 🇮🇳 English (IN)</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div className="footer-col">
      <h3>{title}</h3>
      {items.map(([label, href]) => (
        <Link href={href} key={label}>{label}</Link>
      ))}
    </div>
  );
}
