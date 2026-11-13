"use client";

import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import VenueCard from "./VenueCard";
import { toggleSaved, useSaved } from "./useSaved";

export default function SavedPage({ kind }) {
  const cards = useSaved()[kind] || [];
  return <><Header /><main className="container home-sections">
    <h1>{kind === "compare" ? "Compare venues" : "Your shortlist"}</h1>
    <p>Saved on this device. <Link href="/venues">Explore more venues</Link></p>
    {!cards.length && <p className="empty-state">Add venues to see them here.</p>}
    <div className="venue-grid">{cards.map((card) => <div key={card.id}><VenueCard venue={card} />{kind === "compare" && <button type="button" className="vf-button outline mt-2" onClick={() => toggleSaved(kind, card)}>Remove</button>}</div>)}</div>
  </main><Footer /></>;
}
