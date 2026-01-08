import { supabase } from "@/lib/supabase";
import Link from "next/link"
export default async function GameDetailPage({ params }) {
    const {id} = await params;
    const { data: game, error } = await supabase
      .from("games")
      .select(`
        id,
        player1_score,
        player2_score,
        is_ppv,
        player1:player1_id ( id, name, nickname ),
        player2:player2_id ( id, name, nickname )
      `)
      .eq("id", id)
      .single();
  
    if (error || !game) {
      return <div>Game not found</div>;
    }

    // 2️⃣ Fetch stats for this game
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
        player:player_id ( id, name ),
        fouls
    `)
    .eq("game_id", id);

    // 3️⃣ Separate stats by player
    const player1Stats = stats?.find(
    (s) => s.player.id === game.player1.id
    );

    const player2Stats = stats?.find(
    (s) => s.player.id === game.player2.id
    );

    return (
    <div>
        <h1>Game Detail</h1>

        {/* Matchup */}
        <h2>
        <Link href={`/players/${game.player1.id}`}>
            {game.player1.name}
        </Link>
        {" vs "}
        <Link href={`/players/${game.player2.id}`}>
            {game.player2.name}
        </Link>
        </h2>

        {/* Final Score */}
        <p>
        Final Score: {game.player1_score} – {game.player2_score}
        </p>

        {game.is_ppv && <p>PPV Game</p>}

        {/* Box Score */}
        <h3>Box Score</h3>

        <table border="1" cellPadding="6">
        <thead>
            <tr>
            <th>Stat</th>
            <th>
                <Link href={`/players/${game.player1.id}`}>
                {game.player1.name}
                </Link>
            </th>
            <th>
                <Link href={`/players/${game.player2.id}`}>
                {game.player2.name}
                </Link>
            </th>
            </tr>
        </thead>

        <tbody>
            <tr>
                <td>Points</td>
                <td>{player1Stats?.points ?? "-"}</td>
                <td>{player2Stats?.points ?? "-"}</td>
            </tr>

            <tr>
                <td>FGM</td>
                <td>{player1Stats?.fg_made ?? "-"}</td>
                <td>{player2Stats?.fg_made ?? "-"}</td>
            </tr>

            <tr>
                <td>FGA</td>
                <td>{player1Stats?.fg_attempted ?? "-"}</td>
                <td>{player2Stats?.fg_attempted ?? "-"}</td>
            </tr>
            <tr>
                <td>FG%</td>
                <td>
                    {player1Stats?.fg_attempted
                    ? `${((player1Stats.fg_made / player1Stats.fg_attempted) * 100).toFixed(1)}%`
                    : "-"}
                </td>
                <td>
                    {player2Stats?.fg_attempted
                    ? `${((player2Stats.fg_made / player2Stats.fg_attempted) * 100).toFixed(1)}%`
                    : "-"}
                </td>
                </tr>

            <tr>
                <td>3PM</td>
                <td>{player1Stats?.three_made ?? "-"}</td>
                <td>{player2Stats?.three_made ?? "-"}</td>
            </tr>
            <tr>
                <td>3PA</td>
                <td>{player1Stats?.three_attempted ?? "-"}</td>
                <td>{player2Stats?.three_attempted ?? "-"}</td>
            </tr>
            <tr>
                <td>3P%</td>
                <td>
                    {player1Stats?.three_attempted
                    ? `${((player1Stats.three_made / player1Stats.three_attempted) * 100).toFixed(1)}%`
                    : "-"}
                </td>
                <td>
                    {player2Stats?.fg_attempted
                    ? `${((player2Stats.three_made / player2Stats.three_attempted) * 100).toFixed(1)}%`
                    : "-"}
                </td>
                </tr>

            <tr></tr>
            <tr>
                <td>FTM</td>
                <td>{player1Stats?.ft_made ?? "-"}</td>
                <td>{player2Stats?.ft_made ?? "-"}</td>
            </tr>
            <tr>
                <td>FTA</td>
                <td>{player1Stats?.ft_att ?? "-"}</td>
                <td>{player2Stats?.ft_att ?? "-"}</td>
            </tr>
            <tr>
                <td>FT%</td>
                <td>
                    {player1Stats?.three_attempted
                    ? `${((player1Stats.ft_made / player1Stats.ft_att) * 100).toFixed(1)}%`
                    : "-"}
                </td>
                <td>
                    {player2Stats?.fg_attempted
                    ? `${((player2Stats.ft_made / player2Stats.ft_att) * 100).toFixed(1)}%`
                    : "-"}
                </td>
                </tr>
            <tr>
                <td>Fouls</td>
                <td>{player1Stats?.fouls ?? "-"}</td>
                <td>{player2Stats?.fouls ?? "-"}</td>
            </tr>
            </tbody>

        </table>
    </div>
    );
    }