import "./globals.css";
import AppHeader from "@/components/AppHeader";

export const metadata = {
  title: "Yard Sail",
  description: "Find every sale nearby, then map the fastest route",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
