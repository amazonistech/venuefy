import ServiceBookingRequest from "../../../../components/ServiceBookingRequest";

export default async function Page({ params }) {
  return <ServiceBookingRequest id={(await params).id} />;
}
