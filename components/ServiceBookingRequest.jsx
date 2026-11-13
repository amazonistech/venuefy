"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import RichText from "./RichText";
import usePublicData from "./usePublicData";
import { customerApi, useCustomer } from "./customerSession";
import { asIndiaInput } from "../lib/bookingDisplay";
import { hrefWith, money } from "../lib/publicApi";
import { getImageUrl } from "../lib/venueMapper";

export default function ServiceBookingRequest({ id }) {
  const path = "/services/" + encodeURIComponent(id);
  const resource = usePublicData("/services/public/" + encodeURIComponent(id));
  const customer = useCustomer();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [minimum] = useState(() => asIndiaInput(Date.now(), Math.ceil));
  const service = resource.data;

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const fields = new FormData(event.currentTarget);
      const startAt = fields.get("startAt") + "+05:30";
      if (!(new Date(startAt) > new Date())) throw new Error("Choose a future event date and time.");
      const body = { startAt, location: fields.get("location").trim(), notes: fields.get("notes").trim() };
      const storageKey = "venuefy:service-request:" + (customer.id || customer._id) + ":" + id;
      const payload = JSON.stringify(body);
      const previous = JSON.parse(sessionStorage.getItem(storageKey) || "null");
      const requestKey = previous?.payload === payload ? previous.requestKey : crypto.randomUUID();
      sessionStorage.setItem(storageKey, JSON.stringify({ payload, requestKey }));
      const saved = await customerApi(path + "/booking-requests", { body, headers: { "Idempotency-Key": requestKey } });
      sessionStorage.removeItem(storageKey);
      setResult(saved);
    } catch (failure) {
      setError(Object.values(failure.fields || {}).join(" ") || failure.message);
    } finally { setBusy(false); }
  }

  return <><Header /><main className="container account-content">
    <Link href="/services/list">← Browse services</Link>
    <section className="vf-panel">
      <h1>Request a service booking</h1>
      {resource.loading && <p role="status">Loading service…</p>}
      {resource.error && <p role="alert">{resource.error.message}</p>}
      {service && <div className="service-booking-layout">
        <div>
          {service.image && <img className="service-booking-photo" src={getImageUrl(service.image)} alt={service.name} />}
          <h2>{service.name}</h2>
          <p>{[service.category?.name, service.location].filter(Boolean).join(" · ")}</p>
          <RichText value={service.description} />
        </div>
        <div>
          <p><strong>{money(service.price)}</strong> listed price per event</p>
          <p>The provider will confirm availability and final pricing. Status updates appear in your account notifications.</p>
          {result ? <div role="status"><p>Request sent. Reference {result._id}.</p><Link href="/bookings#service-bookings-heading">View my service bookings</Link></div>
            : !customer ? <Link className="vf-button" href={hrefWith("/login", { next: path + "/book" })}>Log in to continue</Link>
            : <form className="vf-form" onSubmit={submit}>
              <label>Event start (IST) *<input type="datetime-local" name="startAt" min={minimum} required /></label>
              <label>Event location *<input name="location" maxLength={200} placeholder="Venue name or event address" required /></label>
              <label>Notes<textarea name="notes" rows={4} maxLength={1000} placeholder="Tell the provider what you need." /></label>
              {error && <p role="alert" className="vf-error">{error}</p>}
              <button className="vf-button" disabled={busy}>{busy ? "Sending…" : "Send booking request"}</button>
            </form>}
        </div>
      </div>}
    </section>
  </main><Footer /></>;
}
