import PolicyPage from "../../components/PolicyPage";
import { cancellation_refund_policy } from "../../lib/policy-content";

export const metadata = {
  title: "Cancellation, Rescheduling & Refund Policy | Venuefy",
  description: "Cancellation, Rescheduling & Refund Policy for Venuefy, owned and operated by Amazonis IT Services Pvt. Ltd.",
};

export default function Page() {
  return <PolicyPage title="Cancellation, Rescheduling & Refund Policy" blocks={cancellation_refund_policy} />;
}
