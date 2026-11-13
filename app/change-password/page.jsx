import CustomerAuth from "../../components/CustomerAuth";
export default async function Page({ searchParams }) {
  return <CustomerAuth mode="change-password" query={await searchParams} />;
}
