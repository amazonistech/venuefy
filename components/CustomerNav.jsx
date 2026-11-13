"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCustomer } from "./customerSession";

export default function CustomerNav() {
  const customer = useCustomer();
  const path = usePathname();
  return customer ? (
    <Link className="login-btn" href="/bookings">
      My bookings
    </Link>
  ) : (
    <Link
      className="login-btn"
      href={`/login?next=${encodeURIComponent(path)}`}
    >
      Login
    </Link>
  );
}
