import type { Metadata } from "next";
import "./globals.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "EchelonRealty",
  description: "Modern Real Estate Platform",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
    >
      <body className="min-h-screen flex flex-col">
        <AuthProvider>

          <header>
            <Navbar />
          </header>

          <main className="grow w-full">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
