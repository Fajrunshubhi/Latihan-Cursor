import { Fraunces, Outfit } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata = {
  title: "TicketIn | Login Event Ticketing",
  description:
    "Aplikasi ticketing event untuk pemesanan tiket, pembayaran, dan validasi peserta.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${outfit.variable} ${fraunces.variable} font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
