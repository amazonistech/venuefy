"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import RichText from "./RichText";
import usePublicData from "./usePublicData";
import { customerApi, useCustomer } from "./customerSession";
import { publicApi, hrefWith } from "../lib/publicApi";
import { BasePrice, packageRate, QuoteBreakdown } from "./PackagePricing";
import { asIndiaInput, earliestVenueStart, indiaInterval, indiaTime, MAX_BOOKING_INTERVAL_MS, paise } from "../lib/bookingDisplay";

function RequestForm({ venue, enquiry, initialPackage, initialStart, initialGuests }) {
  const router = useRouter();
  const customer = useCustomer();
  const packages = venue.packages || [];
  const [packageId, setPackage] = useState(() => packages.find((item) => item._id === initialPackage)?._id || packages[0]?._id || "");
  const [price, setPrice] = useState(null);
  const [status, setStatus] = useState({});
  const [busy, setBusy] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const selected = packages.find((item) => item._id === packageId);
  const cutoffDays = venue.bookingPolicies?.advanceBookingDays ?? 5;
  const [start, setStart] = useState(initialStart || "");
  const [now] = useState(Date.now);
  const earliest = earliestVenueStart(venue, selected, now);
  const lastEnd = selected?.availableUntil ? Date.parse(selected.availableUntil) : Infinity;
  const minDate = asIndiaInput(earliest, Math.ceil);
  const maxStart = Number.isFinite(lastEnd) ? asIndiaInput(lastEnd - 60000) : undefined;
  const unavailable = !!maxStart && maxStart < minDate;
  const startTime = Date.parse(start + "+05:30");
  const validStart = Number.isFinite(startTime) && start >= minDate && (!maxStart || start <= maxStart);
  const minEnd = validStart ? asIndiaInput(startTime + 60000) : undefined;
  const latestEnd = validStart ? Math.min(startTime + MAX_BOOKING_INTERVAL_MS, lastEnd) : Infinity;
  const maxEnd = Number.isFinite(latestEnd) ? asIndiaInput(latestEnd) : undefined;
  const returnTo = enquiry ? hrefWith("/bookings/new", { venue: venue._id, enquiry }) : hrefWith(`/venue/${encodeURIComponent(venue.slug || venue._id)}/book`, { package: packageId, start: initialStart, guests: initialGuests });

  async function submit(event) {
    event.preventDefault();
    if (busy || !selected) return;
    const action = event.nativeEvent.submitter?.value;
    const fields = new FormData(event.currentTarget);
    setStatus({});
    setPrice(null);
    setBusy(true);
    try {
      const quote = {
        venue: venue._id, packageId, guests: Number(fields.get("guests")),
        addOns: (selected?.addOns || []).map((item) => ({ id: item._id, quantity: Number(fields.get(item._id)) })).filter((item) => item.quantity > 0),
      };
      const spaceId = fields.get("spaceId");
      const dates = indiaInterval(fields.get("start"), fields.get("end"));
      if (action === "preview") {
        const result = await publicApi(hrefWith("/bookings/availability", { venue: venue._id, spaceId, packageId, ...dates }));
        if (!result.available) throw new Error("The venue or space is already reserved for this interval.");
        const preview = await customerApi("/bookings/quote-preview", { body: quote });
        if (preview.packageId !== quote.packageId) throw new Error("The price response did not match your selected package. Check the price again.");
        setPrice(preview);
        setStatus({ message: "Available at the time of this check. The venue reserves your dates after approval." });
        return;
      }
      const body = {
        ...quote, ...dates,
        ...(spaceId && { spaceId }), ...(enquiry && { enquiryId: enquiry }), eventType: selected.eventType, notes: fields.get("notes"), mode: action || "booking",
      };
      const storedKey = `venuefy:request:${customer.id || customer._id}:${venue._id}`;
      const payload = JSON.stringify(body);
      const previous = JSON.parse(sessionStorage.getItem(storedKey) || "null");
      const key = previous?.payload === payload ? previous.key : crypto.randomUUID();
      sessionStorage.setItem(storedKey, JSON.stringify({ payload, key }));
      const result = await customerApi("/bookings", { body, headers: { "Idempotency-Key": key } });
      sessionStorage.removeItem(storedKey);
      router.replace(`/bookings/${result._id}`);
    } catch (error) { setStatus({ error: error.message, fields: error.fields }); }
    finally { setBusy(false); }
  }

  if (!customer) return <><BasePrice venue={venue} selected={selected} /><p><Link className="vf-button" href={hrefWith("/login", { next: returnTo })}>Log in to continue</Link></p></>;
  if (enquiry && !claimed) return <div className="vf-form">
    <p>Link this enquiry to your account using the verified email address on the enquiry.</p>
    <button type="button" className="vf-button" disabled={busy} onClick={async () => {
      setBusy(true); setStatus({});
      try { await customerApi(`/enquiries/${enquiry}/claim`, { body: {} }); setClaimed(true); }
      catch (error) { setStatus({ error: error.message }); }
      finally { setBusy(false); }
    }}>Link enquiry to my account</button>
    {status.error && <p role="alert" className="vf-error">{status.error}</p>}
  </div>;
  if (!packages.length) return <><BasePrice venue={venue} /><p>Ask the venue team for package information before booking.</p></>;

  return <form className="vf-form" onSubmit={submit} onChange={() => { setPrice(null); setStatus({}); }}>
    <BasePrice venue={venue} selected={selected} />
    <fieldset disabled={busy} className="booking-inputs">
    <div className="vf-field-grid">
      <label>Package *<select name="packageId" value={packageId} required onChange={(event) => setPackage(event.target.value)}>{packages.map((item) => <option value={item._id} key={item._id}>{item.name} · {packageRate(venue, item)}</option>)}</select></label>
      <label>Space<select name="spaceId"><option value="">Whole venue</option>{venue.spaces?.map((item) => <option value={item._id} key={item._id}>{item.name}</option>)}</select></label>
      <label>Guests *<input name="guests" type="number" defaultValue={initialGuests} min={selected?.minGuests || venue.minGuests || 1} max={selected?.maxGuests || venue.maxGuests || 1000000} required /></label>
      <label>Event start (IST) *<input name="start" type="datetime-local" value={start} onChange={(event) => setStart(event.target.value)} min={minDate} max={maxStart} disabled={unavailable} required /></label>
      <label>Event end (IST) *<input name="end" type="datetime-local" min={minEnd} max={maxEnd} disabled={!validStart || unavailable} required /></label>
    </div>
    {selected && <div className="booking-window">
      {(cutoffDays > 0 || selected.availableFrom || selected.availableUntil) && <ul>
        {cutoffDays > 0 && <li>Book at least {cutoffDays} {cutoffDays === 1 ? "day" : "days"} before the event.</li>}
        {selected.availableFrom && <li>Event starts on or after {indiaTime(selected.availableFrom)} IST.</li>}
        {selected.availableUntil && <li>Event ends by {indiaTime(selected.availableUntil)} IST.</li>}
      </ul>}
    </div>}
    {unavailable ? <p role="alert" className="vf-error">This package has no booking dates left in its availability window. Choose another package.</p> : <p className="catalog-caption">Earliest event start: {indiaTime(earliest)} IST. Select a start before choosing the end.</p>}
    <RichText value={selected?.description} />
    {selected?.addOns?.length > 0 && <fieldset key={packageId} className="vf-field-grid"><legend>Optional add-ons</legend>{selected.addOns.map((item) => <label key={item._id}>{item.name} ({paise(Math.round(item.price * 100))} each)<input name={item._id} type="number" min="0" max={item.maxQuantity || 1} defaultValue="0" /></label>)}</fieldset>}
    <label>Notes for the venue<textarea name="notes" rows="3" maxLength="1000" /></label>
    </fieldset>
    {status.error && <p role="alert" className="vf-error">{status.error}</p>}
    {status.fields && <ul className="vf-error">{Object.entries(status.fields).map(([field, message]) => <li key={field}>{field}: {message}</li>)}</ul>}
    {status.message && <p role="status">{status.message}</p>}
    {price?.packageId === packageId && <QuoteBreakdown price={price} />}
    <div className="account-links booking-request-actions">
      <button className="vf-button" name="mode" value="booking" disabled={busy || unavailable}>Request booking</button>
      <button className="vf-button outline" name="mode" value="preview" disabled={busy || unavailable}>{busy ? "Please wait…" : "Check availability & price"}</button>
      <button className="vf-button outline" name="mode" value="enquiry" disabled={busy || unavailable}>Send enquiry</button>
      <button className="vf-button outline" name="mode" value="draft" disabled={busy || unavailable}>Save draft</button>
    </div>
  </form>;
}

export default function BookingRequest({ id, enquiry, initialPackage, initialStart, initialGuests }) {
  const resource = usePublicData(`/venue/public/${encodeURIComponent(id)}`);
  return <><Header /><main className="container account-content"><Link href={`/venue/${encodeURIComponent(id)}`}>← Back to venue</Link>
    <section className="vf-panel booking-request-panel"><span className="vf-kicker">Venue booking</span><h1>Plan your event</h1>
      {resource.loading && <p role="status">Loading venue packages…</p>}
      {resource.error && <p role="alert">{resource.error.message}</p>}
      {resource.data && <><h2>{resource.data.venueName}</h2><p>Your booking request goes to the venue for approval. Any advance will appear in My bookings.</p><RequestForm key={resource.data._id} venue={resource.data} enquiry={enquiry} initialPackage={initialPackage} initialStart={initialStart} initialGuests={initialGuests} /></>}
    </section></main><Footer /></>;
}
