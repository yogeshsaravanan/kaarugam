import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Tanjai Silks — Kanchipuram silk sarees",
  description: "Traditional, modern, and bridal silk sarees. Customise colours, border and pallu, and check out securely.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Nav />
          {children}
          <div style={{ textAlign: "center", padding: "26px 18px", fontSize: 11.5, opacity: 0.5 }}>
            Tanjai Silks — demo boutique. Photo try-on coming soon.
          </div>
        </Providers>
      </body>
    </html>
  );
}
