import VenueDetailsClient from "../../../../components/VenueDetailsClient";
export const metadata = { title: "Venue Photo Tour | Venuefy" };
export default async function Page({ params }) {
  return <VenueDetailsClient id={(await params).id} tour />;
}
