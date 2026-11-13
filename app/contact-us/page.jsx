import ContactPage from "../../components/ContactPage";
export const metadata = { title: "Contact Us | Venuefy" };
export default async function Page({ searchParams }) {
  const { subject } = await searchParams;
  return <ContactPage subject={typeof subject === "string" ? subject.slice(0, 200) : ""} />;
}
