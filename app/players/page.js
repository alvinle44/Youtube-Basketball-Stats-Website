"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function fetchPlayers() {
    const { data, error } = await supabase
      .from("players")
      .select("id, name, nickname")
      .order("name", { ascending: true });

    if (!error && data) {
      setPlayers(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchPlayers();
  }, []);

  const filteredPlayers = useMemo(() => {
    const term = search.toLowerCase();

    return players.filter((player) =>
      player.name.toLowerCase().includes(term) ||
      (player.nickname &&
        player.nickname.toLowerCase().includes(term))
    );
  }, [players, search]);

  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold">Players</h1>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search players..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full
          bg-zinc-900
          p-3
          rounded-xl
          outline-none
          focus:ring-2
          focus:ring-yellow-500
        "
      />

      {loading && <p className="text-zinc-400">Loading...</p>}

      {!loading && filteredPlayers.length === 0 && (
        <p className="text-zinc-400">No players found.</p>
      )}

      {/* PLAYER LIST */}
      <div className="space-y-4">
        {filteredPlayers.map((player) => (
          <Link
          key={player.id}
          href={`/players/${player.id}`}
          className="
            block
            bg-zinc-900
            rounded-xl
            p-4
            transition
            text-center
            hover:bg-yellow-500
            hover:text-black
            active:scale-95
          "
        >
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold">
              {player.name}
            </span>
        
            {player.nickname && (
              <span className="text-xs text-zinc-400">
                {player.nickname}
              </span>
            )}
          </div>
        </Link>
        ))}
      </div>

    </div>
  );
}