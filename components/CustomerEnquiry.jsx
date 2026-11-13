"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import useCustomerData from "./useCustomerData";
import { useCustomer, customerApi } from "./customerSession";
import { hrefWith } from "../lib/publicApi";
import { indiaTime, stateLabel } from "../lib/bookingDisplay";

export default function CustomerEnquiry({ id }) {
  const customer = useCustomer();
  const path = `/enquiries/${encodeURIComponent(id)}`;
  const resource = useCustomerData(customer ? path : null);
  const [status, setStatus] = useState({});
  const [busy, setBusy] = useState(false);
  const row = resource.data;
  async function attach(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const files = [...form.elements.attachments.files];
    if (files.length + (row.attachments?.length || 0) > 10 || files.some((file) => file.size > 5 * 1024 * 1024)) {
      setStatus({ error: "Choose JPEG, PNG or PDF files up to 5 MB each. An enquiry can contain up to 10 files." });
      return;
    }
    setBusy(true);
    setStatus({});
    try {
      await customerApi(path + "/attachments", { body: new FormData(form) });
      form.reset(); resource.reload(); setStatus({ message: "Files uploaded." });
    } catch (error) { setStatus({ error: error.message }); }
    finally { setBusy(false); }
  }
  async function download(file) {
    setStatus({});
    try {
      const blob = await customerApi(`${path}/attachments/${file._id}`, { blob: true });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = file.name; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) { setStatus({ error: error.message }); }
  }
  return <><Header /><main className="container account-content"><Link href="/account/enquiries">← My enquiries</Link><h1>Enquiry details</h1>
    {!customer && <Link className="vf-button" href={hrefWith("/login", { next: `/account/enquiries/${id}` })}>Log in to continue</Link>}
    {resource.loading && <p role="status">Loading enquiry…</p>}
    {resource.error && <p role="alert">{resource.error.message}</p>}
    {row && <section className="vf-panel"><h2>{row.reference}</h2><p>{stateLabel(row.status)} · {stateLabel(row.eventType)} · {indiaTime(row.eventDate)} IST</p>
      <p>{row.description}</p><Link className="vf-button" href={hrefWith("/bookings/new", { venue: row.venue, enquiry: row._id })}>Continue to booking</Link>
      <h3 className="mt-3">Your attachments</h3>
      {row.attachments?.map((file) => <p key={file._id}><button type="button" className="vf-text-button" onClick={() => download(file)}>{file.name}</button></p>)}
      {(row.attachments?.length || 0) < 10 && <form className="vf-form" onSubmit={attach}>
        <label>JPEG, PNG or PDF, up to 5 MB per file<input name="attachments" type="file" accept="image/jpeg,image/png,application/pdf" multiple required /></label>
        <button type="submit" className="vf-button outline" disabled={busy}>Upload files</button>
      </form>}
      {status.error && <p role="alert" className="vf-error">{status.error}</p>}
      {status.message && <p role="status" className="vf-success">{status.message}</p>}
    </section>}
  </main><Footer /></>;
}
