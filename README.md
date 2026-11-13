# Venuefy public site

Next.js App Router website for venue and service discovery, customer accounts, bookings, and support.

## Run locally

1. Install Node.js 20.19+ and run `npm ci`.
2. Copy `.env.example` to `.env.local`. Set `NEXT_PUBLIC_BACKEND_SERVER` to the Venuefy API base, including `/api`.
3. Start the Venuefy backend and run `npm run dev`. For production use `npm run build` followed by `npm start`.

Deploy the included backend update alongside the site. Set backend `CUSTOMER_FRONTEND_URL` to the customer site origin with no trailing slash, for example `https://venuefy.in`. Keep the partner origin under the existing `FRONTEND_URL` setting. The customer origin is allowed by CORS and used in customer verification and password reset emails.

Customer signup and OTP resend use the existing mail configuration. The phone-step code is delivered to the registered email. Enquiry ownership uses verified matching email. Configure SMTP for customer onboarding and recovery. Existing Razorpay test keys and the webhook setup are required to exercise advance payments in test mode. The site requests the order and sends the checkout proof to the backend for capture verification.

The service catalog uses published coordinates when available. The current service model stores a location string. Venue map pins come from venue coordinates. Maps use configurable tiles and show OpenStreetMap attribution for the default layer.

Content for About, Contact, Company Details and Footer is based on the supplied company references. Manrope is the main UI font. Playfair Display is used for the premium wedding campaign headline.
