import { money } from "./publicApi";

export function getImageUrl(image) {
  if (typeof image !== "string" || !image.trim()) return "";
  if (/^https?:\/\//i.test(image)) return image;
  const base = (
    process.env.NEXT_PUBLIC_BACKEND_SERVER || "http://localhost:5000/api"
  )
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");
  return `${base}/${image.replace(/\\/g, "/").replace(/^\.?\/+/, "")}`;
}

function locationOf(record) {
  return (
    [record.city, record.state].filter(Boolean).join(", ") ||
    record.location ||
    ""
  );
}

function coordinates({ latitude, longitude, geoLocation }) {
  const [lng, lat] = geoLocation?.coordinates || [];
  const pair = [latitude ?? lat, longitude ?? lng];
  if (pair.some((value) => value == null || value === "")) return null;
  const [a, b] = pair.map(Number);
  return Number.isFinite(a) &&
    Number.isFinite(b) &&
    Math.abs(a) <= 90 &&
    Math.abs(b) <= 180
    ? [a, b]
    : null;
}

export function mapVenueCard(venue) {
  const rating = venue.reviewSummary?.averageRating ?? venue.rating;
  const reviews = venue.reviewSummary?.reviewCount ?? venue.reviews ?? 0;
  return {
    id: venue._id,
    slug: venue.slug,
    name: venue.venueName || "Venue",
    city: venue.city,
    location: locationOf(venue),
    category: venue.category?.name || "Venue",
    rating,
    reviews,
    guests: venue.maxGuests
      ? [venue.minGuests, venue.maxGuests].filter(Boolean).join("–") + " guests"
      : "",
    rawPrice: venue.price,
    price: money(venue.price),
    isFixedPrice: venue.isFixedPrice,
    image: getImageUrl(venue.coverImage || venue.images?.[0]),
    coordinates: coordinates(venue),
    href: `/venue/${encodeURIComponent(venue.slug || venue._id)}`,
    approved: venue.status === "approved",
  };
}

export function mapVenueDetails(venue) {
  const sections = (venue.mediaSections || [])
    .filter((item) => item.isVisible !== false)
    .map((section) => ({
      title: section.heading || "Venue media",
      description: section.description,
      items: (section.items || [])
        .map((item) => ({
          src: getImageUrl(item.file),
          kind: item.kind || "image",
          caption: item.caption,
        }))
        .filter((item) => item.src),
    }))
    .filter((item) => item.items.length);
  const gallery = [
    ...new Set(
      [
        venue.coverImage,
        ...(venue.images || []),
        ...(venue.spaces || []).map((item) => item.photo),
      ].filter(Boolean),
    ),
  ].map((file) => ({ src: getImageUrl(file), kind: "image" }));
  const all = [
    ...new Map(
      [...gallery, ...sections.flatMap((item) => item.items)].map((item) => [
        item.src,
        item,
      ]),
    ).values(),
  ];
  return {
    ...mapVenueCard(venue),
    record: venue,
    media: all,
    sections,
    gallery,
  };
}

export function mapServiceCard(service) {
  return {
    id: service._id,
    name: service.name || "Service",
    imageUrl: getImageUrl(service.image),
    location: locationOf(service),
    price: money(service.price),
    description: service.description,
    coordinates: coordinates(service),
    categoryId: service.category?._id || service.category || "",
    categoryName: service.category?.name,
  };
}
