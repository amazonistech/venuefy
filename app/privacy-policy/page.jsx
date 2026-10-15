import PolicyPage from "../../components/PolicyPage";
import { privacy_policy } from "../../lib/policy-content";

export const metadata = {
  title: "Privacy Policy | Venuefy",
  description: "Privacy Policy for Venuefy, owned and operated by Amazonis IT Services Pvt. Ltd.",
};

export default function Page() {
  return <PolicyPage title="Privacy Policy" blocks={privacy_policy} />;
}
