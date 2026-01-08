import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "YouTube Basektball Hub",
  description: "Track YouTube basketball games, players, and standings from OTD, TNC, BIL, etc.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Navigation Bar */}
        <nav 
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #e5e5e5",
            display: "flex",
            gap: "16px",
            fontweight:500
            }}
          >
            <Link href="/">Home</Link>
            <Link href="/games">Games</Link>
            <Link href="/players">Players</Link>
            <Link href="/standings">Standings</Link>
        </nav>
        {/* Page Content */}
        <main style={{padding:24}}>
          {children}
        </main>
        <footer
          style={{
            marginTop: 48,
            padding: 16,
            fontSize: 12,
            color: "#888",
            textAlign: "center",
            borderTop: "1px solid #e5e5e5",
          }}
        >
          This website is a fan-made project and is not affiliated with the NBA,
          YouTube, or any professional basketball league.
        </footer>
      </body>
    </html>
  );
}
