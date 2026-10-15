import VenueDetailsClient from "../../../components/VenueDetailsClient";
export default async function VenuePage({ params }) {
  const { id } = await params;
  return <VenueDetailsClient id={id} />;
}
