import PolicyPage from "../../components/PolicyPage";
import { refund_policy } from "../../lib/policy-content";

export const metadata = {
  title: "Refund Policy | Venuefy",
  description: "Refund Policy for Venuefy, owned and operated by Amazonis IT Services Pvt. Ltd.",
};

export default function Page() {
  return <PolicyPage title="Refund Policy" blocks={refund_policy} />;
}
