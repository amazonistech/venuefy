import BookingRequest from "../../../components/BookingRequest";
import { notFound } from "next/navigation";

export default async function Page({ searchParams }) {
  const { venue, enquiry } = await searchParams;
  if (typeof venue !== "string" || !/^[a-f0-9]{24}$/i.test(venue)) notFound();
  return (
    <BookingRequest
      id={venue}
      enquiry={
        typeof enquiry === "string" && /^[a-f0-9]{24}$/i.test(enquiry)
          ? enquiry
          : ""
      }
    />
  );
}
