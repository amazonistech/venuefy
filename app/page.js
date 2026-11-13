import { redirect } from "next/navigation";
import HomePageClient from "../components/HomePageClient";
import { hrefWith } from "../lib/publicApi";

export default async function HomePage({ searchParams }) {
  const query = await searchParams;
  const value = (key) =>
    typeof query[key] === "string" ? query[key].trim() : "";
  if (value("serviceCategory"))
    redirect(
      hrefWith("/services/list", {
        category: value("serviceCategory"),
        search: value("search"),
      }),
    );
  if (value("search") || value("category"))
    redirect(
      hrefWith("/venues", {
        search: value("search"),
        category: value("category"),
      }),
    );
  return <HomePageClient />;
}
