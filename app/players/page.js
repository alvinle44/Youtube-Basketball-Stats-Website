import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function PlayerPage() {
  const { data: players, error } = await supabase
    .from("players")
    .select("id, name, nickname");

  if (error) {
    return <div>Error loading players.</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Players</h1>

      {players.map((player) => (
        <div key={player.id}>
          <Link href={`/players/${player.id}`}>
            {player.name}
          </Link>
          {player.nickname && ` (${player.nickname})`}
        </div>
      ))}
    </div>
  );
}
