import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";
import AppHeader from "@/components/AppHeader";

// Load the site fonts. Each one creates a CSS variable, and globals.css decides
// where each font is used (--font-heading and --font-body).
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Yard Sail",
  description: "Find local yard sales and plan your stops",
};

// Wraps every page. Takes the current page as `children` and shows it below the header.
export default function RootLayout({ children }) {
  return (
    // The font classes go on <html> so the font variables work on every page.
    <html lang="en" className={`${dmSans.variable} ${inter.variable}`}>
      <body>
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
