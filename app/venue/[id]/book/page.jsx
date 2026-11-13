import BookingRequest from "../../../../components/BookingRequest";
export default async function Page({ params, searchParams }) {
  const { id } = await params;
  const { package: packageId, start, guests } = await searchParams;
  const initialStart = typeof start === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(start) ? start : "";
  const initialGuests = typeof guests === "string" && /^[1-9]\d{0,6}$/.test(guests) && Number(guests) <= 1000000 ? guests : "";
  return <BookingRequest id={id} initialPackage={packageId} initialStart={initialStart} initialGuests={initialGuests} />;
}
