import CustomerAuth from "../../components/CustomerAuth";
export default async function Page({ searchParams }) {
  return <CustomerAuth mode="signup" query={await searchParams} />;
}
