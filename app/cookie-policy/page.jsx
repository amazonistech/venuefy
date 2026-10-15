import PolicyPage from "../../components/PolicyPage";
import { cookie_policy } from "../../lib/policy-content";

export const metadata = {
  title: "Cookie Policy | Venuefy",
  description: "Cookie Policy for Venuefy, owned and operated by Amazonis IT Services Pvt. Ltd.",
};

export default function Page() {
  return <PolicyPage title="Cookie Policy" blocks={cookie_policy} />;
}
