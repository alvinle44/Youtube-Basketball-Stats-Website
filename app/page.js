import Link from "next/link";
export default function HomePage() {
  return (
    <div className="space-y-16">

      {/* HERO */}
      <div>
        <h1 className="text-5xl font-bold mb-4">
          YouTube Basketball Hub
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl">
          Browse YouTube basketball games, player profiles, and rankings
          from TNC, BIL, OTD, and more.
        </p>
      </div>

      {/* FEATURE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Link href="/games">
        <div className="bg-zinc-900 p-6 rounded-xl transition-all hover:bg-yellow-500 hover:text-black cursor-pointer">
          <h2 className="text-xl font-semibold mb-2">Games</h2>
          <p className="text-zinc-400 text-sm">
            View match history and detailed box scores.
          </p>
        </div>
        </Link>
        <Link href="/players">

        <div className="bg-zinc-900 p-6 rounded-xl transition-all hover:bg-yellow-500 hover:text-black cursor-pointer">
          <h2 className="text-xl font-semibold mb-2">Players</h2>
          <p className="text-zinc-400 text-sm">
            Explore player stats and performance breakdowns.
          </p>
        </div>
        </Link>
        <Link href="/standings">
        <div className="bg-zinc-900 p-6 rounded-xl transition-all hover:bg-yellow-500 hover:text-black cursor-pointer">
          <h2 className="text-xl font-semibold mb-2">Standings</h2>
          <p className="text-zinc-400 text-sm">
            See updated rankings based on win percentage.
          </p>
        </div>
        </Link>
      </div>

    </div>
  );
}