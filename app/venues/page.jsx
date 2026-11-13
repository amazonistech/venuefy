import CatalogPage from "../../components/CatalogPage";
import { eventTypes } from "../../lib/publicApi";

export const metadata = { title: "Explore Venues | Venuefy" };

export default async function VenueList({ searchParams }) {
  const query = await searchParams;
  const values = Object.fromEntries(
    [
      "search",
      "city",
      "category",
      "type",
      "guests",
      "eventType",
      "date",
      "minPrice",
      "maxPrice",
    ]
      .filter((key) => typeof query[key] === "string" && query[key].trim())
      .map((key) => [key, query[key].trim().slice(0, 100)]),
  );
  if (values.eventType && !Object.hasOwn(eventTypes, values.eventType))
    delete values.eventType;
  if (values.category && !/^[a-f0-9]{24}$/i.test(values.category))
    delete values.category;
  return <CatalogPage kind="venues" values={values} />;
}
