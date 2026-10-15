import PolicyPage from "../../components/PolicyPage";
import { terms_and_conditions } from "../../lib/policy-content";

export const metadata = {
  title: "Terms & Conditions | Venuefy",
  description: "Terms & Conditions for Venuefy, owned and operated by Amazonis IT Services Pvt. Ltd.",
};

export default function Page() {
  return <PolicyPage title="Terms & Conditions" blocks={terms_and_conditions} />;
}
