import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { QueryProvider } from "./components/query-provider";

// eslint-disable-next-line new-cap
const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "MovieVault",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="app">
          <Suspense>
            <QueryProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
            </QueryProvider>
          </Suspense>
        </div>
      </body>
    </html>
  );
}
