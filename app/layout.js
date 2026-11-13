import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "remixicon/fonts/remixicon.css";
import "@fontsource-variable/manrope";
import "@fontsource-variable/playfair-display";
import "leaflet/dist/leaflet.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./globals.css";
import ReduxProvider from "../components/ReduxProvider";

export const metadata = {
  title: "Venuefy — Find the perfect venue",
  description: "Wedding, party and corporate venue discovery platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" type="image/x-icon" href="/images/fav.ico"></link>
      </head>
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
