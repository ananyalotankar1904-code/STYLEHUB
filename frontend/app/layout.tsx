import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";

export const metadata: Metadata = {
  title: "StyleHub — Your AI-Powered Digital Closet",
  description:
    "StyleHub helps you build the perfect outfit using your existing wardrobe, powered by AI. Made for the next generation of fashion-forward individuals.",
  keywords: ["fashion", "AI", "outfit", "closet", "style", "wardrobe"],
  openGraph: {
    title: "StyleHub",
    description: "Your AI-powered personal stylist",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#FAF6EE" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Chatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
