"use client";

import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import SearchBar from "./SearchBar";
import ServiceCard from "./ServiceCard";
import usePublicData from "./usePublicData";
import { hrefWith } from "../lib/publicApi";
import { mapServiceCard } from "../lib/venueMapper";

function CategoryRow({ category }) {
  const path = hrefWith("/services/list", { category: category._id });
  const resource = usePublicData(hrefWith("/services/public", { category: category._id, limit: 6 }));
  const services = (resource.data?.services || []).map(mapServiceCard);
  if (!services.length && !resource.loading && !resource.error) return null;
  return <section className="service-row">
    <div className="section-title-row"><div><h2>{category.name}</h2><p>Find professionals for your event</p></div><Link href={path}>View all <i className="bi bi-arrow-right" /></Link></div>
    {resource.loading && <p role="status">Loading {category.name}…</p>}
    {resource.error && <p role="alert">Could not load this category. <Link href={path}>Browse category</Link></p>}
    <div className="service-preview-grid">{services.map((service) => <ServiceCard key={service.id} service={service} />)}</div>
  </section>;
}

export default function ServicesHome() {
  const data = usePublicData("/service-categories/public?limit=100");
  const choices = data.data?.categories || data.data?.serviceCategories || [];
  return <><Header />
    <div className="container service-finder"><SearchBar service categories={choices} /></div>
    <section className="service-banner"><div className="container"><span className="vf-kicker">For memorable occasions</span><h1>Event services near you</h1><p>Find photography, décor, catering and more for your celebration.</p><Link className="vf-button" href="/services/list">Browse all services</Link></div></section>
    <main className="container home-sections">
      <div className="type-chips">{choices.map((item) => <Link className="outline-chip" key={item._id} href={hrefWith("/services/list", { category: item._id })}><i className="bi bi-stars" /> {item.name}</Link>)}</div>
      {data.loading && <p role="status">Loading services…</p>}
      {data.error && <p role="alert">{data.error.message}</p>}
      {!data.loading && !data.error && !choices.length && <p className="empty-state">No service categories have been published yet.</p>}
      {choices.slice(0, 8).map((category) => <CategoryRow key={category._id} category={category} />)}
      <Link className="vf-button outline" href="/services/list">Explore more services <i className="bi bi-arrow-right" /></Link>
    </main>
    <Footer />
  </>;
}
