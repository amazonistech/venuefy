import { BookingDetails } from "../../../components/CustomerBookings";
export default async function Page({ params }) {
  return <BookingDetails id={(await params).id} />;
}
