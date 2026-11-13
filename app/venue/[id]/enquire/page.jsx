import VenueEnquiry from "../../../../components/VenueEnquiry";
export default async function Page({ params, searchParams }) {
  return (
    <VenueEnquiry
      id={(await params).id}
      visit={(await searchParams).type === "visit"}
    />
  );
}
