import type { Metadata } from "next";
import { Dosis } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/shared/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";

const dosis = Dosis({
  subsets: ["latin"],
  variable: "--font-dosis",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Free QR Code Generator – Create Custom QR Codes Instantly",
  description:
    "Generate custom QR codes for URLs, WiFi, UPI payments, and more instantly. Free, fast, no sign-up required.",
  openGraph: {
    title: "Free QR Code Generator – QR Code Studio",
    description: "Create custom QR codes for free. Supports WiFi, UPI, URLs, contacts, and more.",
    images: ["/og-banner.png"],
    url: "https://qr.dariogeorge.in",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free QR Code Generator – QR Code Studio",
    description: "Create custom QR codes instantly. Free, no sign-up.",
    images: ["/og-banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dosis.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
