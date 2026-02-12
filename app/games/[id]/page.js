import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function GameDetailPage({ params }) {

  const { id } = await params;

  if (!id) return <div>Invalid game ID</div>;

  // Fetch game
  const { data: game, error } = await supabase
    .from("games")
    .select(`
      id,
      created_at,
      game_date,
      game_video_link,
      player1_score,
      player2_score,
      is_ppv,
      target_score,
      platform,
      game_type,
      player1:player1_id (id, name, nickname),
      player2:player2_id (id, name, nickname)
    `)
    .eq("id", id)
    .single();

  if (error || !game) return <div>Game not found</div>;

  // Fetch stats
  const { data: stats } = await supabase
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
      player:player_id (id)
    `)
    .eq("game_id", id);

  // Scalable player structure
  const players = [
    {
      info: game.player1,
      score: game.player1_score,
      stats: stats?.find(s => s.player.id === game.player1.id)
    },
    {
      info: game.player2,
      score: game.player2_score,
      stats: stats?.find(s => s.player.id === game.player2.id)
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">

      {/* ================= HEADER CARD ================= */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-10 text-center space-y-6">

        <h1 className="text-4xl font-bold">Game Detail</h1>

        {/* META TAGS */}
        <div className="flex flex-wrap justify-center gap-3 text-sm">

          {game.platform && (
            game.game_video_link ? (
              <a
                href={game.game_video_link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-900 px-4 py-1 rounded-md hover:bg-yellow-500 hover:text-black transition font-medium"
              >
                {game.platform}
              </a>
            ) : (
              <span className="bg-zinc-900 px-4 py-1 rounded-md">
                {game.platform}
              </span>
            )
          )}

          {game.game_type && (
            game.game_video_link ? (
              <a
                href={game.game_video_link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-900 px-4 py-1 rounded-md hover:bg-yellow-500 hover:text-black transition font-medium"
              >
                {game.game_type}
              </a>
            ) : (
              <span className="bg-zinc-900 px-4 py-1 rounded-md">
                {game.game_type}
              </span>
            )
          )}

          {game.target_score && (
            <span className="bg-zinc-900 px-4 py-1 rounded-md">
              First to {game.target_score}
            </span>
          )}

          {game.game_date && (
            <span className="bg-zinc-900 px-4 py-1 rounded-md">
              {new Date(game.game_date).toLocaleDateString()}
            </span>
          )}

          {game.is_ppv && (
            <span className="gold-text font-semibold">
              PPV
            </span>
          )}

        </div>

        {/* SCORE DISPLAY */}
        <div className="flex justify-center items-center gap-20 mt-8">

          {players.map(player => (
            <div key={player.info.id} className="text-center flex-1">

              <Link
                href={`/players/${player.info.id}`}
                className="hover:gold-text transition"
              >
                <div className="flex flex-col items-center">
                  <span className="text-xl font-semibold">
                    {player.info.name}
                  </span>

                  {player.info.nickname && (
                    <span className="text-xs text-zinc-400">
                      {player.info.nickname}
                    </span>
                  )}
                </div>
              </Link>

              <p className="text-5xl font-bold gold-text mt-2">
                {player.score}
              </p>

            </div>
          ))}

        </div>

        {/* WATCH GAME BUTTON */}
        {game.game_video_link && (
          <div className="mt-6">
            <a
              href={game.game_video_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-yellow-500 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition"
            >
              Watch Full Game →
            </a>
          </div>
        )}

      </div>

      {/* ================= BOX SCORE TABLE ================= */}
      <div className="overflow-x-auto bg-zinc-950 border border-zinc-800 rounded-2xl">

        <table className="min-w-full text-sm text-center">

          <thead className="bg-zinc-900 text-zinc-400 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Player</th>
              <th className="px-6 py-3">PTS</th>
              <th className="px-6 py-3">FGM</th>
              <th className="px-6 py-3">FGA</th>
              <th className="px-6 py-3">FG%</th>
              <th className="px-6 py-3">3PM</th>
              <th className="px-6 py-3">3PA</th>
              <th className="px-6 py-3">3P%</th>
              <th className="px-6 py-3">FTM</th>
              <th className="px-6 py-3">FTA</th>
              <th className="px-6 py-3">FT%</th>
              <th className="px-6 py-3">TO</th>
              <th className="px-6 py-3">Fouls</th>
            </tr>
          </thead>

          <tbody>
            {players.map((player, index) => {

              const s = player.stats || {};

              return (
                <tr
                  key={player.info.id}
                  className={index % 2 === 0 ? "bg-zinc-900/40" : ""}
                >
                  <td className="px-6 py-3 text-left font-semibold">
                    <Link
                      href={`/players/${player.info.id}`}
                      className="hover:gold-text transition"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          {player.info.name}
                        </span>

                        {player.info.nickname && (
                          <span className="text-xs text-zinc-400">
                            {player.info.nickname}
                          </span>
                        )}
                      </div>
                    </Link>
                  </td>

                  <td>{s.points ?? "-"}</td>
                  <td>{s.fg_made ?? "-"}</td>
                  <td>{s.fg_attempted ?? "-"}</td>
                  <td>
                    {s.fg_attempted
                      ? `${((s.fg_made / s.fg_attempted) * 100).toFixed(1)}%`
                      : "-"}
                  </td>

                  <td>{s.three_made ?? "-"}</td>
                  <td>{s.three_attempted ?? "-"}</td>
                  <td>
                    {s.three_attempted
                      ? `${((s.three_made / s.three_attempted) * 100).toFixed(1)}%`
                      : "-"}
                  </td>

                  <td>{s.ft_made ?? "-"}</td>
                  <td>{s.ft_att ?? "-"}</td>
                  <td>
                    {s.ft_att
                      ? `${((s.ft_made / s.ft_att) * 100).toFixed(1)}%`
                      : "-"}
                  </td>

                  <td>{s.turnover ?? "-"}</td>
                  <td>{s.fouls ?? "-"}</td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

    </div>
  );
}