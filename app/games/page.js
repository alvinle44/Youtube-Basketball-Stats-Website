import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function GamesPage() {
  const { data: games, error } = await supabase
    .from("games")
    .select("id, player1_id, player2_id, player1_score, player2_score, is_ppv, player1:player1_id ( id,name,nickname ), player2:player2_id (id,name,nickname)");

  if (error) {
    return <div>Error loading games</div>;
  }

  if (!games || games.length === 0) {
    return <p>No games yet.</p>;
  }

  return (
    <div>
      <h1>Games</h1>

      {games.map((game) => (
        <div style={{ marginBottom: 12 }}>
        <Link href={`/players/${game.player1.id}`}>
          {game.player1.name}
        </Link>
      
        {" vs "}
      
        <Link href={`/players/${game.player2.id}`}>
          {game.player2.name}
        </Link>
      
        {" — "}
      
        <Link href={`/games/${game.id}`}>
          {game.player1_score}–{game.player2_score}
        </Link>
      
        {game.is_ppv && " (PPV)"}
      </div>
      ))}
    </div>
  );
}
