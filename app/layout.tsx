import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost";
  const protocol = h.get("x-forwarded-proto") ?? "https";
  const image = `${protocol}://${host}/og.png`;
  return {
    title: "Linda Deng — Design / Research / Technology",
    description: "Design research across material, computation, architecture, and ecology.",
    openGraph: { title: "Linda Deng — Design / Research / Technology", description: "Design research across material, computation, architecture, and ecology.", images: [image] },
    twitter: { card: "summary_large_image", title: "Linda Deng — Design / Research / Technology", description: "Design research across material, computation, architecture, and ecology.", images: [image] },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${mono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
