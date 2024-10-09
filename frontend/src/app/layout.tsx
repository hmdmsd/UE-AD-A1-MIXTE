import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MovieBook - Your Ultimate Movie Booking Experience",
  description: "Discover, book, and enjoy the latest movies with MovieBook.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex flex-col min-h-screen bg-gray-900 text-white`}
      >
        <Header />
        <main className="flex-grow bg-texture">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
