import CustomerAuth from "../../components/CustomerAuth";
export default async function Page({ searchParams }) {
  return <CustomerAuth mode="verify-phone" query={await searchParams} />;
}
