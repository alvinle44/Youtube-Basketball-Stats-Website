"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const [platformFilter, setPlatformFilter] = useState("");
  const [search, setSearch] = useState("");

  const PAGE_SIZE = 10;

  async function fetchGames(reset = false) {
    setLoading(true);

    let query = supabase
      .from("games")
      .select(`
        id,
        created_at,
        platform,
        game_date, 
        game_video_link,
        game_type,
        target_score,
        player1_score,
        player2_score,
        is_ppv,
        player1:player1_id (id,name,nickname),
        player2:player2_id (id,name,nickname)
      `)
      .order("game_date", { ascending: false })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

    if (platformFilter) {
      query = query.eq("platform", platformFilter);
    }

    const { data, error } = await query;

    if (!error) {
      if (reset) {
        setGames(data);
      } else {
        setGames((prev) => [...prev, ...data]);
      }
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchGames(true);
  }, [platformFilter]);

  return (
    <div className="space-y-10">

      <h1 className="text-4xl font-bold">Games</h1>

      {/* FILTER BAR */}
      <div className="flex gap-4 flex-wrap">

        <select
          className="bg-zinc-900 p-2 rounded-md"
          value={platformFilter}
          onChange={(e) => {
            setPage(0);
            setPlatformFilter(e.target.value);
          }}
        >
          <option value="">All Platforms</option>
          <option value="The Next Chapter">The Next Chapter</option>
          <option value="OTD">OTD</option>
          <option value="BIL">BIL</option>
        </select>

      </div>

      {/* GAME LIST */}
      <div className="space-y-6">
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/games/${game.id}`}
            className="block bg-zinc-900 rounded-2xl p-8 hover:bg-zinc-800 transition"
          >
            <div className="flex justify-between text-xs text-zinc-400 mb-6">
              <div className="flex gap-3">
                {game.platform && (
                  <span className="bg-zinc-800 px-3 py-1 rounded-md">
                    {game.platform}
                  </span>
                )}
                {game.game_type && (
                  <span className="bg-zinc-800 px-3 py-1 rounded-md">
                    {game.game_type}
                  </span>
                )}
                {game.target_score && (
                  <span className="bg-zinc-800 px-3 py-1 rounded-md">
                    First to {game.target_score}
                  </span>
                )}
              </div>

              {game.is_ppv && (
                <span className="text-orange-500 font-semibold">
                  PPV
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 items-center">
              <div>
                <p className="text-lg font-semibold">
                  {game.player1.name}
                </p>
                <p className="text-4xl font-bold text-orange-500 mt-2">
                  {game.player1_score}
                </p>
              </div>

              <div className="text-center text-zinc-500 font-medium">
                VS
              </div>

              <div className="text-right">
                <p className="text-lg font-semibold">
                  {game.player2.name}
                </p>
                <p className="text-4xl font-bold text-orange-500 mt-2">
                  {game.player2_score}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* LOAD MORE */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            setPage((prev) => prev + 1);
          }}
          className="bg-orange-500 px-6 py-2 rounded-md hover:bg-orange-600 transition"
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>

    </div>
  );
}