import CatalogPage from "../../../components/CatalogPage";

export const metadata = { title: "Browse Event Services | Venuefy" };

export default async function ServiceList({ searchParams }) {
  const query = await searchParams;
  const values = Object.fromEntries(["search", "category", "minPrice", "maxPrice"]
    .filter((key) => typeof query[key] === "string" && query[key].trim()).map((key) => [key, query[key].trim().slice(0, 100)]));
  if (values.category && !/^[a-f0-9]{24}$/i.test(values.category)) delete values.category;
  return <CatalogPage kind="services" values={values} />;
}
