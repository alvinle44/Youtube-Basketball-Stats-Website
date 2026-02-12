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
  title: "YouTube Basketball Hub",
  description:
    "Track YouTube basketball games, players, and standings from OTD, TNC, BIL, etc.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black text-white`}
      >
        <div className="min-h-screen flex flex-col">

          {/* NAV */}
          <nav className="border-b border-zinc-800 bg-black">
            <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
              
              <span className="text-lg font-semibold">
                YT Basketball Hub
              </span>

              <div className="flex gap-8 text-sm">
                <Link href="/" className="px-4 py-2 rounded-md transition duration-200 hover:bg-yellow-400 hover:text-black">
                  Home
                </Link>
                <Link href="/games" className="px-4 py-2 rounded-md transition duration-200 hover:bg-yellow-400 hover:text-black">
                  Games
                </Link>
                <Link href="/players" className="px-4 py-2 rounded-md transition duration-200 hover:bg-yellow-400 hover:text-black">
                  Players
                </Link>
                <Link href="/standings" className="px-4 py-2 rounded-md transition duration-200 hover:bg-yellow-400 hover:text-black">
                  Standings
                </Link>
              </div>

            </div>
          </nav>

          {/* CONTENT */}
          <main className="flex-1">
            <div className="max-w-5xl mx-auto px-6 py-16">
              {children}
            </div>
          </main>

          {/* FOOTER */}
          <footer className="border-t border-zinc-800 text-zinc-500 text-xs py-6">
            <div className="max-w-5xl mx-auto text-center">
              This website is a fan-made project and is not affiliated with the NBA,
              YouTube, or any professional basketball league.
            </div>
          </footer>

        </div>
      </body>
    </html>
  );
}