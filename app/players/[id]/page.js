import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function PlayerDetailPage({ params }) {
  const { id } = await params;

  const { data: player } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .single();

  if (!player) return <div>Player not found</div>;

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
        game_date,
        is_ppv,
        player1_score,
        player2_score,
        player1:player1_id ( id, name ),
        player2:player2_id ( id, name )
      )
    `)
    .eq("player_id", id)
    .order("game_date", { foreignTable: "game", ascending: false });

  const gamesPlayed = games?.length ?? 0;

  let wins = 0;
  let losses = 0;
  let ppvWins = 0;
  let ppvLosses = 0;

  let totals = {
    points: 0,
    opponentPoints: 0,
    fgm: 0,
    fga: 0,
    ftm: 0,
    fta: 0,
    tpm: 0,
    tpa: 0,
    turnovers: 0,
    fouls: 0
  };

  games?.forEach(row => {

    const g = row.game;
    const isPlayer1 = g.player1.id === id;

    const playerScore = isPlayer1 ? g.player1_score : g.player2_score;
    const opponentScore = isPlayer1 ? g.player2_score : g.player1_score;

    const isWin = playerScore > opponentScore;

    if (isWin) wins++;
    else losses++;

    if (g.is_ppv) {
      if (isWin) ppvWins++;
      else ppvLosses++;
    }

    totals.points += row.points ?? 0;
    totals.opponentPoints += opponentScore ?? 0;
    totals.fgm += row.fg_made ?? 0;
    totals.fga += row.fg_attempted ?? 0;
    totals.ftm += row.ft_made ?? 0;
    totals.fta += row.ft_att ?? 0;
    totals.tpm += row.three_made ?? 0;
    totals.tpa += row.three_attempted ?? 0;
    totals.turnovers += row.turnover ?? 0;
    totals.fouls += row.fouls ?? 0;
  });

  const avg = (val) =>
    gamesPlayed ? (val / gamesPlayed).toFixed(1) : "0.0";

  const winPct = gamesPlayed
    ? ((wins / gamesPlayed) * 100).toFixed(1)
    : "0.0";

  const ppvGames = ppvWins + ppvLosses;

  const ppvWinPct = ppvGames
    ? ((ppvWins / ppvGames) * 100).toFixed(1)
    : "0.0";

  const fgPct = totals.fga
    ? ((totals.fgm / totals.fga) * 100).toFixed(1)
    : "0.0";

  const ftPct = totals.fta
    ? ((totals.ftm / totals.fta) * 100).toFixed(1)
    : "0.0";

  const threePct = totals.tpa
    ? ((totals.tpm / totals.tpa) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">

      {/* PLAYER HEADER */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-10">

      <div className="max-w-4xl mx-auto space-y-8">

        {/* TOP ROW: IMAGE + NAME */}
        <div className="flex items-center justify-center gap-10">

          {/* PROFILE IMAGE */}
          <div className="flex-shrink-0">
            {player.avatar_url && (
              <img
                src={player.avatar_url}
                alt={player.name}
                className="h-40 object-contain"
              />
            )}
          </div>

          {/* NAME + SOCIAL */}
          <div className="text-left space-y-2">

            <h1 className="text-4xl font-bold">
              {player.name}
            </h1>

            {player.nickname && (
              <p className="text-zinc-400 text-lg">
                ({player.nickname})
              </p>
            )}

            {/* SOCIAL ICONS */}
            <div className="flex gap-4 mt-3">

              {player.instagram && (
                <a
                  href={player.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition"
                >
                  <img
                    src="/icons/instagram-color.png"
                    alt="Instagram"
                    className="w-10 h-10"
                  />
                </a>
              )}

              {player.youtube && (
                <a
                  href={player.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition"
                >
                  <img
                    src="/icons/youtube-color.png"
                    alt="YouTube"
                    className="w-10 h-10"
                  />
                </a>
              )}

            </div>

          </div>

        </div>

        {/* BIO INFO */}
        <div className="text-center text-zinc-400 space-y-1">
          {player.height && <p>Height: {player.height}</p>}
          {player.weight && <p>Weight: {player.weight}</p>}
          {player.hometown && <p>Hometown: {player.hometown}</p>}
          {player.college && <p>College: {player.college}</p>}
        </div>

        {/* CAREER SUMMARY INLINE */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center pt-4">

          <div>
            <p className="text-zinc-400 text-sm">Record</p>
            <p className="text-2xl font-bold gold-text">
              {wins}–{losses}
            </p>
          </div>

          <div>
            <p className="text-zinc-400 text-sm">Win %</p>
            <p className="text-2xl font-bold">
              {winPct}%
            </p>
          </div>

          <div>
            <p className="text-zinc-400 text-sm">PPV Record</p>
            <p className="text-2xl font-bold">
              {ppvWins}–{ppvLosses}
            </p>
          </div>

          <div>
            <p className="text-zinc-400 text-sm">PPV Win %</p>
            <p className="text-2xl font-bold">
              {ppvWinPct}%
            </p>
          </div>

        </div>

      </div>

      </div>

      {/* GAME LOG */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-x-auto">

        <h2 className="text-xl font-semibold p-6">
          Game Log
        </h2>

        <table className="min-w-full text-sm text-center">

          <thead className="bg-zinc-900 text-zinc-400 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Opponent</th>
              <th className="px-4 py-3">Result</th>
              <th className="px-4 py-3">PTS</th>
              <th className="px-4 py-3">Opp PTS</th>
              <th className="px-4 py-3">FGM</th>
              <th className="px-4 py-3">FGA</th>
              <th className="px-4 py-3">FG%</th>
              <th className="px-4 py-3">3PM</th>
              <th className="px-4 py-3">3PA</th>
              <th className="px-4 py-3">3P%</th>
              <th className="px-4 py-3">FTM</th>
              <th className="px-4 py-3">FTA</th>
              <th className="px-4 py-3">FT%</th>
              <th className="px-4 py-3">TO</th>
              <th className="px-4 py-3">Fouls</th>
            </tr>
          </thead>

          <tbody>

            {games?.map((row, index) => {

              const g = row.game;
              const isPlayer1 = g.player1.id === id;

              const opponent = isPlayer1
                ? g.player2
                : g.player1;

              const playerScore = isPlayer1
                ? g.player1_score
                : g.player2_score;

              const opponentScore = isPlayer1
                ? g.player2_score
                : g.player1_score;

              const result =
                playerScore > opponentScore ? "W" : "L";

              return (
                <tr key={g.id}
                    className={index % 2 === 0 ? "bg-zinc-900/40" : ""}>

                  <td className="px-4 py-3 text-left">
                    {new Date(g.game_date).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-left">
                    <Link
                      href={`/players/${opponent.id}`}
                      className="hover:gold-text"
                    >
                      {opponent.name}
                    </Link>
                  </td>

                  <td className={`px-4 py-3 font-semibold ${
                    result === "W"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}>
                    {result} {playerScore}–{opponentScore}
                  </td>

                  <td>{row.points}</td>
                  <td>{opponentScore}</td> 
                  <td>{row.fg_made}</td>
                  <td>{row.fg_attempted}</td>
                  <td>
                    {row.fg_attempted
                      ? `${((row.fg_made / row.fg_attempted) * 100).toFixed(1)}%`
                      : "-"}
                  </td>
                  <td>{row.three_made}</td>
                  <td>{row.three_attempted}</td>
                  <td>
                    {row.three_attempted
                      ? `${((row.three_made / row.three_attempted) * 100).toFixed(1)}%`
                      : "-"}
                  </td>
                  <td>{row.ft_made}</td>
                  <td>{row.ft_att}</td>
                  <td>
                    {row.ft_att
                      ? `${((row.ft_made / row.ft_att) * 100).toFixed(1)}%`
                      : "-"}
                  </td>
                  <td>{row.turnover}</td>
                  <td>{row.fouls}</td>

                </tr>
              );
            })}

            {/* Averages Row */}
            <tr className="bg-zinc-900 font-semibold">
              <td colSpan="3">Averages</td>
              <td>{avg(totals.points)}</td>
              <td>{avg(totals.opponentPoints)}</td>
              <td>{avg(totals.fgm)}</td>
              <td>{avg(totals.fga)}</td>
              <td>{fgPct}%</td>
              <td>{avg(totals.tpm)}</td>
              <td>{avg(totals.tpa)}</td>
              <td>{threePct}%</td>
              <td>{avg(totals.ftm)}</td>
              <td>{avg(totals.fta)}</td>
              <td>{ftPct}%</td>
              <td>{avg(totals.turnovers)}</td>
              <td>{avg(totals.fouls)}</td>
            </tr>

          </tbody>
        </table>

      </div>

    </div>
  );
}