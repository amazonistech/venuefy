import CustomerEnquiry from "../../../../components/CustomerEnquiry";
export default async function Page({ params }) { return <CustomerEnquiry id={(await params).id} />; }
