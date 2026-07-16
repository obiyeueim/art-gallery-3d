import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AN / ATELIER — Original Art in 3D",
  description:
    "Không gian trưng bày tranh nguyên bản với trải nghiệm tương tác 3D từ AN Atelier.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
