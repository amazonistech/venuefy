import CustomerAuth from '../../components/CustomerAuth'; export const metadata = { referrer: "no-referrer" };
export default async function Page({ searchParams }) { return <CustomerAuth mode='verify-email' query={await searchParams} />; }
