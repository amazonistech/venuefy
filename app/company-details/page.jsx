import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { company } from "../../lib/company";

export const metadata = { title: "Company Details | Venuefy" };
export default function Page() {
  return <><Header /><main className="container editorial-body"><span className="vf-kicker">Venuefy™</span><h1>Company details</h1>
    <section><h2>Platform operator</h2><p><a href={company.url}>{company.name}</a> develops and owns Venuefy, the venue discovery, enquiry and booking platform.</p><address>{company.address}</address></section>
    <section><h2>Venuefy support</h2><p><a href={`mailto:${company.support}`}>{company.support}</a> · <a href="tel:+918796955210">{company.supportPhone}</a></p></section>
    <section><h2>Parent company contact</h2><p><a href={`mailto:${company.email}`}>{company.email}</a> · <a href="tel:+919971228021">{company.phone}</a></p></section>
    <section><h2>Grievance redressal</h2><p>For concerns about Venuefy, a listing, a booking or a payment, email <a href={`mailto:${company.support}`}>{company.support}</a>.</p></section>
  </main><Footer /></>;
}
