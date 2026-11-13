"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, A11y, Pagination } from "swiper/modules";
import RichText from "./RichText";

const modules = [Navigation, Keyboard, A11y, Pagination];
function Media({ item, controls = false, alt = "" }) {
  if (item.kind === "video") return controls ? <video src={item.src} controls preload="metadata" aria-label={item.caption || alt} /> : <span className="media-video"><i className="bi bi-play-circle" /> Video</span>;
  return <img src={item.src} alt={item.caption || alt} loading="lazy" />;
}

function Slides({ items, start = 0, thumbnails = false, onOpen }) {
  return <Swiper modules={modules} initialSlide={start} navigation={items.length > 1} keyboard={{ enabled: true }} pagination={items.length > 1 ? { clickable: true } : false}
    slidesPerView={thumbnails ? 1.4 : 1} spaceBetween={thumbnails ? 8 : 0}
    breakpoints={thumbnails ? { 480: { slidesPerView: 2.5 }, 780: { slidesPerView: 4 }, 1100: { slidesPerView: 5 } } : undefined}>
    {items.map((item, index) => <SwiperSlide key={item.src + index}>{thumbnails ? (
      <button type="button" className="photo-trigger" aria-label={`Open photo or video ${index + 1}`} onClick={() => onOpen(index)}><Media item={item} /></button>
    ) : <figure><Media item={item} controls alt={`Venue photo ${index + 1}`} />{item.caption && <figcaption>{item.caption}</figcaption>}</figure>}</SwiperSlide>)}
  </Swiper>;
}

function Lightbox({ items, index, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => { if (dialog.open) dialog.close(); };
  }, []);
  return <dialog className="photo-dialog" ref={ref} onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} aria-label="Venue photo viewer">
    <div className="photo-dialog-body">
      <button type="button" autoFocus className="photo-close" onClick={onClose} aria-label="Close photo viewer"><i className="bi bi-x-lg" /></button>
      <Slides items={items} start={index} />
    </div>
  </dialog>;
}

export default function DetailsGallery({ venue, tour = false }) {
  const [index, setIndex] = useState(null);
  const items = venue.media;
  if (!items.length) return <p className="empty-state">Photos will appear when the venue adds them.</p>;
  if (tour) {
    const covered = new Set(venue.sections.flatMap((section) => section.items.map((item) => item.src)));
    const others = items.filter((item) => !covered.has(item.src));
    const sections = [...venue.sections, ...(others.length ? [{ title: "Venue gallery", items: others }] : [])];
    return <>
      <div className="photo-strip"><Slides items={items} thumbnails onOpen={setIndex} /></div>
      <div className="photo-sections">{sections.map((section, sectionIndex) => <section key={section.title + sectionIndex}>
        <h2>{section.title}</h2><RichText value={section.description} />
        <div className="photo-mosaic">{section.items.map((item, itemIndex) => <button className="photo-trigger" key={item.src + itemIndex} type="button" aria-label={`Open ${section.title} media ${itemIndex + 1}`} onClick={() => setIndex(items.findIndex(({ src }) => src === item.src))}><Media item={item} /></button>)}</div>
      </section>)}</div>
      {index !== null && <Lightbox items={items} index={index} onClose={() => setIndex(null)} />}
    </>;
  }
  return <>
    <div className={`venue-mosaic count-${Math.min(items.length, 5)}`}>
      {items.slice(0, 5).map((item, i) => <button type="button" className="photo-trigger" key={item.src} aria-label={`View venue media ${i + 1}`} onClick={() => setIndex(i)}><Media item={item} /></button>)}
      <Link className="all-photos" href={venue.href + "/photos"}><i className="bi bi-images" /> View all {items.length}</Link>
    </div>
    {index !== null && <Lightbox items={items} index={index} onClose={() => setIndex(null)} />}
  </>;
}
