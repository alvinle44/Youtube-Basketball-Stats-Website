import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function PlayerDetailPage({ params }) {
  // 1️⃣ Get player id from route
  const { id } = await params;

  // 2️⃣ Fetch player info
  const { data: player, error: playerError } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .single();

  if (playerError || !player) {
    return <div>Player not found</div>;
  }

  // 3️⃣ Fetch all games + stats for this player
  const { data: games } = await supabase
    .from("stats")
    .select(`
      points,
      fg_made,
      fg_attempted,
      ft_made,
      ft_att,
      three_made,
      three_attempted,
      turnover,
      fouls,
      game:game_id (
        id,
        created_at,
        player1_score,
        player2_score,
        is_ppv,
        player1:player1_id ( id, name ),
        player2:player2_id ( id, name )
      )
    `)
    .eq("player_id", id)
    .order("created_at", {
      foreignTable: "game",
      ascending: false,
    });

  // 4️⃣ Career summary calculations
  const gamesPlayed = games?.length ?? 0;
  let wins = 0;
  let losses = 0;

  games?.forEach((row) => {
    const game = row.game;
    const isPlayer1 = game.player1.id === id;

    const playerScore = isPlayer1
      ? game.player1_score
      : game.player2_score;

    const opponentScore = isPlayer1
      ? game.player2_score
      : game.player1_score;

    if (playerScore > opponentScore) wins++;
    else losses++;
  });

  const winPct =
    gamesPlayed > 0
      ? ((wins / gamesPlayed) * 100).toFixed(1)
      : "0.0";

  // 5️⃣ Render page
  return (
    <div>
      {/* ===== PLAYER HEADER ===== */}
      <h1>{player.name}</h1>
      {player.nickname && <h2>({player.nickname})</h2>}

      {/* ===== PLAYER BIO ===== */}
      <p>
        {player.height && <>Height: {player.height} ft<br /></>}
        {player.weight && <>Weight: {player.weight} lb<br /></>}
        {player.hometown && <>Hometown: {player.hometown}<br /></>}
        {player.college && <>College: {player.college}</>}
      </p>

      {/* ===== CAREER SUMMARY ===== */}
      <div style={{ marginBottom: 24 }}>
        <h3>Career Summary</h3>
        <p>
          <strong>Record:</strong> {wins}–{losses}
        </p>
        <p>
          <strong>Win %:</strong> {winPct}%
        </p>
        <p>
          <strong>Games Played:</strong> {gamesPlayed}
        </p>
      </div>

      {/* ===== GAME LOG ===== */}
      <h3>Game Log</h3>

      {(!games || games.length === 0) && (
        <p>No games played yet.</p>
      )}

      {games && games.length > 0 && (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Date</th>
              <th>Opponent</th>
              <th>Result</th>
              <th>PTS</th>
              <th>FGM</th>
              <th>FGA</th>
              <th>FG%</th>
              <th>FTM</th>
              <th>FTA</th>
              <th>FT%</th>
              <th>3PM</th>
              <th>3PA</th>
              <th>3P%</th>
              <th>TO</th>
              <th>Game</th>
            </tr>
          </thead>

          <tbody>
            {games.map((row) => {
              const game = row.game;
              const isPlayer1 = game.player1.id === id;

              const opponent = isPlayer1
                ? game.player2
                : game.player1;

              const playerScore = isPlayer1
                ? game.player1_score
                : game.player2_score;

              const opponentScore = isPlayer1
                ? game.player2_score
                : game.player1_score;

              const result =
                playerScore > opponentScore ? "W" : "L";

              return (
                <tr key={game.id}>
                  <td>
                    {new Date(game.created_at).toLocaleDateString()}
                  </td>

                  <td>
                    <Link href={`/players/${opponent.id}`}>
                      vs {opponent.name}
                    </Link>
                  </td>

                  <td>
                    {result} {playerScore}–{opponentScore}
                  </td>

                  <td>{row.points}</td>

                  <td>{row.fg_made}</td>
                  <td>{row.fg_attempted}</td>
                  <td>
                    {row.fg_attempted
                      ? `${(
                          (row.fg_made / row.fg_attempted) *
                          100
                        ).toFixed(1)}%`
                      : "-"}
                  </td>

                  <td>{row.ft_made}</td>
                  <td>{row.ft_att}</td>
                  <td>
                    {row.ft_att
                      ? `${(
                          (row.ft_made / row.ft_att) *
                          100
                        ).toFixed(1)}%`
                      : "-"}
                  </td>

                  <td>{row.three_made}</td>
                  <td>{row.three_attempted}</td>
                  <td>
                    {row.three_attempted
                      ? `${(
                          (row.three_made /
                            row.three_attempted) *
                          100
                        ).toFixed(1)}%`
                      : "-"}
                  </td>

                  <td>{row.turnover}</td>

                  <td>
                    <Link href={`/games/${game.id}`}>
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
