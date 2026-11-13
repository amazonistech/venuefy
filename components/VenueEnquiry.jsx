"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import usePublicData from "./usePublicData";
import { publicApi, hrefWith, eventTypes } from "../lib/publicApi";
import { useCustomer } from "./customerSession";

export default function VenueEnquiry({ id, visit }) {
  const resource = usePublicData(`/venue/public/${encodeURIComponent(id)}`);
  const customer = useCustomer();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const { guests, visitTime, ...values } = fields;
      const body = {
        ...values, venue: resource.data._id, eventDate: values.eventDate + "T12:00:00+05:30",
        ...(guests && { minGuests: Number(guests), maxGuests: Number(guests) }),
        ...(visit && { requirements: { request: "Venue visit", ...(visitTime && { preferredVisit: visitTime + " IST" }) } }),
      };
      setResult(await publicApi("/enquiries/public", { body }));
    } catch (failure) {
      setError(Object.values(failure.fields || {}).join(" ") || failure.message);
    } finally { setBusy(false); }
  }
  return <><Header /><main className="container account-content"><Link href={`/venue/${encodeURIComponent(id)}`}>← Back to venue</Link>
    <section className="vf-panel"><h1>{visit ? "Request a venue visit" : "Ask the venue team"}</h1>
      {resource.loading && <p role="status">Loading venue…</p>}
      {resource.error && <p role="alert">{resource.error.message}</p>}
      {resource.data && <><h2>{resource.data.venueName}</h2>
        {result ? <div role="status"><p>Your request was received. Reference {result.reference}.</p><Link href={hrefWith("/bookings/new", { venue: resource.data._id, enquiry: result.enquiryId })}>Link this enquiry to your account or continue to booking</Link></div> :
          <form className="vf-form" onSubmit={submit}>
            {visit && <p>Suggest a time for your visit. The venue team will review the request.</p>}
            <div className="vf-field-grid">
              <label>Full name *<input name="name" maxLength="100" defaultValue={customer?.name} required /></label>
              <label>Email address *<input name="email" type="email" maxLength="254" defaultValue={customer?.email} required /></label>
              <label>Phone *<input name="phone" type="tel" maxLength="20" defaultValue={customer?.phone} required /></label>
              <label>Event type *<select name="eventType">{Object.entries(eventTypes).map(([key, title]) => <option key={key} value={key}>{title}</option>)}</select></label>
              <label>Event date *<input type="date" name="eventDate" required /></label>
              <label>Guests{visit && " *"}<input type="number" name="guests" min="1" max="1000000" required={visit} /></label>
              {visit && <label>Preferred visit time (IST)<input type="datetime-local" name="visitTime" /></label>}
            </div>
            <label>Event details<textarea name="description" rows="4" maxLength="5000" /></label>
            {error && <p role="alert" className="vf-error">{error}</p>}
            <button className="vf-button" type="submit" disabled={busy}>{busy ? "Sending…" : "Send request"}</button>
          </form>}
      </>}
    </section></main><Footer /></>;
}
