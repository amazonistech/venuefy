"use client";

import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { publicApi } from "../lib/publicApi";
import { company } from "../lib/company";

export default function ContactPage({ subject }) {
  const [feedback, setFeedback] = useState({});
  const [busy, setBusy] = useState(false);
  async function send(event) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const body = Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, value.trim()]));
    if (!body.phone) delete body.phone;
    setBusy(true);
    setFeedback({});
    try {
      const data = await publicApi("/contact", { body });
      setFeedback({ reference: data.reference });
      form.reset();
    } catch (error) {
      setFeedback({ error: error.message, fields: error.fields });
    } finally { setBusy(false); }
  }
  return <><Header />
    <main>
      <section className="editorial-hero"><div className="container"><span className="vf-kicker">Venuefy support</span><h1>How can we help?</h1><p>Get help with a listing, an enquiry or a booking.</p></div></section>
      <div className="container contact-layout">
        <aside className="contact-info"><h2>Talk to Venuefy</h2><a href={`mailto:${company.support}`}><i className="bi bi-envelope" /> {company.support}</a><a href="tel:+918796955210"><i className="bi bi-telephone" /> {company.supportPhone}</a><div><h3>Registered office</h3><address>{company.name}<br />{company.address}</address></div><p>For booking or payment concerns, include your booking reference so we can find the right record.</p></aside>
        <section className="vf-panel"><h2>Send us a message</h2>
          <form className="vf-form" onSubmit={send}>
            <div className="vf-field-grid">
              {[
                ["name","Full name","text",2,100,true],["email","Email address","email",0,254,true],
                ["phone","Phone (optional)","tel",0,20,false],["subject","Subject","text",2,200,true],
              ].map(([key,label,type,min,max,required]) => <label key={key}>{label}{required && " *"}
                <input name={key} type={type} minLength={min} maxLength={max} required={required} defaultValue={key === "subject" ? subject : undefined} aria-invalid={Boolean(feedback.fields?.[key])} />
                {feedback.fields?.[key] && <small role="alert">{feedback.fields[key]}</small>}
              </label>)}
            </div>
            <label>Message *<textarea name="message" rows="5" minLength="10" maxLength="5000" required aria-invalid={Boolean(feedback.fields?.message)} />
              {feedback.fields?.message && <small role="alert">{feedback.fields.message}</small>}
            </label>
            {feedback.error && <p role="alert" className="vf-error">{feedback.error}</p>}
            {feedback.reference && <p role="status" className="vf-success">Your message was received. Reference {feedback.reference}.</p>}
            <button type="submit" className="vf-button" disabled={busy}>{busy ? "Sending…" : "Send message"}</button>
          </form>
        </section>
      </div>
    </main><Footer /></>;
}
