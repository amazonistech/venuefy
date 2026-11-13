import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { company } from "../../lib/company";
import { partnerPortal } from "../../lib/publicApi";

export const metadata = { title: "About Us | Venuefy" };
const steps = [
  [
    "Discover possibilities",
    "Explore venue categories and find settings that match your occasion, location and guest list.",
  ],
  [
    "Understand each space",
    "Look through photos, capacity, facilities, packages and pricing shared by venue partners.",
  ],
  [
    "Connect and take the next step",
    "Share your event requirements and connect with the team that manages the venue.",
  ],
];
export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="editorial-hero about-hero">
          <div className="container">
            <span className="vf-kicker">About Venuefy™</span>
            <h1>Every celebration deserves the right place</h1>
            <p>Discover spaces for the moments you want to remember.</p>
          </div>
        </section>
        <article className="container editorial-body">
          <section>
            <h2>A place for moments that matter</h2>
            <p>
              A venue is where families come together, stories unfold and
              milestones become memories. We built Venuefy to make finding that
              place an exciting part of planning your event.
            </p>
          </section>
          <section>
            <h2>Our story</h2>
            <p>
              Planning often starts with a simple question: where should we
              celebrate? Answering it can mean comparing incomplete listings and
              asking the same questions repeatedly. Venuefy began with the idea
              of bringing venue discovery and the next steps of planning
              together.
            </p>
          </section>
          <section>
            <h2>Who we are</h2>
            <p>
              Venuefy is an India-focused discovery, enquiry and booking
              platform. We connect people planning events with venue partners
              and help them understand each venue’s location, capacity,
              facilities and pricing.
            </p>
          </section>
          <section>
            <h2>Made for every kind of celebration</h2>
            <p>
              From an intimate birthday to a wedding with hundreds of guests,
              the right space depends on the occasion. Explore banquet halls,
              outdoor venues, hotels, farmhouses and resorts based on your
              preferences and budget.
            </p>
          </section>
          <section>
            <h2>How Venuefy helps</h2>
            <div className="editorial-steps">
              {steps.map(([title, body], index) => (
                <div className="vf-panel" key={title}>
                  <span className="vf-kicker">0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2>For the people planning the occasion</h2>
            <p>
              Dates, budgets, travel and guest lists already take time to
              organise. We want to make it easier to find the information you
              need before you enquire.
            </p>
          </section>
          <section>
            <h2>For the people behind the venues</h2>
            <p>
              Venue partners can show their spaces, share important details,
              receive enquiries and manage booking activity in one place.
            </p>
          </section>
          <section>
            <h2>A connected event ecosystem</h2>
            <p>
              Photography, décor, catering and planning all help bring an
              occasion to life. Our broader vision is to connect customers,
              venues and event professionals in one experience.
            </p>
          </section>
          <section>
            <h2>What we believe</h2>
            <p>
              Clarity, choice and trust matter when you plan an event. Venuefy
              aims to support responsible listings and transparent communication
              between customers and venue teams.
            </p>
          </section>
          <section>
            <h2>Our mission</h2>
            <p>
              To simplify venue discovery and booking through accessible
              technology, useful information and stronger connections between
              customers and venue businesses.
            </p>
          </section>
          <section>
            <h2>Our vision</h2>
            <p>
              To make finding an event space across India easier and more
              transparent, and give venue businesses of different sizes a way to
              be discovered online.
            </p>
          </section>
        </article>
        <section className="ownership">
          <div className="container">
            <span className="vf-kicker">Proudly developed and owned by</span>
            <h2>
              <a href={company.url}>{company.name}</a>
            </h2>
            <p>
              Amazonis provides the technology foundation and long-term product
              direction for Venuefy.
            </p>
          </div>
        </section>
        <section className="container editorial-body">
          <h2>The next memory begins here</h2>
          <p>Find a place that feels right for your celebration.</p>
          <div className="account-links">
            <Link className="vf-button" href="/venues">
              Explore venues
            </Link>
            <a className="vf-button outline" href={partnerPortal}>
              List your venue
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
