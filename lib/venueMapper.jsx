export function getImageUrl(image) {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  const base = (process.env.NEXT_PUBLIC_BACKEND_SERVER || "")
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");
  const cleanPath = String(image).replace(/\\/g, "/").replace(/^\.?\//, "").replace(/^\//, "");
  return base ? `${base}/${cleanPath}` : `/${cleanPath}`;
}

function formatPrice(value) {
  const price = Number(value);
  return Number.isFinite(price) ? price.toLocaleString("en-IN") : "Contact for price";
}

export function mapVenueCard(venue) {
  const image = getImageUrl(venue?.images?.[0]);
  const categoryName = venue?.category?.name || "Venue";
  const rawPrice = Number(venue?.price || 0);
  return {
    id: venue?._id,
    slug: venue?.slug,
    name: venue?.venueName || "Venue",
    location: venue?.location || "Location not specified",
    category: categoryName,
    rating: venue?.rating ?? null,
    reviews: venue?.reviews ?? 0,
    guests:
      venue?.keyHighlights?.find((item) => /guest|capacity/i.test(item?.text || ""))?.text ||
      "Capacity details unavailable",
    rawPrice,
    price: formatPrice(rawPrice),
    image,
  };
}

export function mapVenueDetails(venue) {
  if (!venue) return null;
  const images = (venue.images || []).map(getImageUrl).filter(Boolean);
  return {
    id: venue._id,
    slug: venue.slug,
    name: venue.venueName || "Venue",
    location: venue.location || "Location not specified",
    category: venue.category?.name || "Venue",
    images,
    price: Number(venue.price || 0),
    rating: venue.rating ?? null,
    reviews: venue.reviews ?? 0,
    overview: venue.overview || "No overview has been added for this venue yet.",
    highlights: venue.venueHighlights || [],
    amenities: venue.amenitiesAndServices || [],
    policies: venue.policies || [],
    things: (venue.thingsToKnow || []).map((item) => [item.key, item.value]),
    stats: (venue.keyHighlights || []).map((item) => ({
      icon: item.iconTag || "bi-check2-circle",
      value: item.number || "",
      label: item.text || "",
    })),
    vendor: venue.vendor || null,
  };
}

export function mapServiceCard(service) {
  return {
    id: service?._id,
    name: service?.name || "Service",
    imageUrl: getImageUrl(service?.image),
    location: service?.location || "Location not specified",
    price: Number(service?.price || 0),
    description: service?.description || "",
    categoryId: service?.category?._id || service?.category || "",
    categoryName: service?.category?.name || "Wedding service",
    vendor: service?.vendor || null,
  };
}
