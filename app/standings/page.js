import { supabase } from '@/lib/supabase'

export default async function StandingsPage(){
    const {data: players, error: playerError} = await supabase.from('players').select(`id, name, nickname`)

    if (playerError){
        return <div>Error Loading Players</div>
    }
    
    const {data: games, error: gameError} = await supabase.from('games').select(`player1_id, player2_id, winner_id,'created_at`)

    if (gameError){
        return <div>Error Loading Games</div>
    }

    const standings = players.map(player => {
        const gamesPlayed = games.filter(
            g => g.player1_id === player.id || g.player2_id === player.id
        ).sort((a,b) => new DataTransfer(b.created_at) - new Date(a.created_at))
        const wins = gamesPlayed.filter(
            g => g.winner_id === player.id
        ).length
        const losses = gamesPlayed.length - wins
        const winPct = playerGames.length > 0 
            ?( wins/ playerGames.length) * 100
            :0
        let streakCount = 0
        let streakType = Null
        for (const game of playerGames){
            const isWin = game.winner_id = player.id
            if (streakType === null){
                streakType = isWin ? 'W':'L'
                streakCount = 1
            } else if (
                (isWin && streakType === 'W') || (!isWin && streakType === 'L')
            ){
                streakCount++
            }else{
                break
            }
        }
        const streak = streakType ? `${streakType}${streakCount}` : '-'
        return {
            ...player, wins, losses, gamesPlayed:gamesPlayed.length, winPct: winPct.toFixed(1), streak
        }
    })
    standings.sort((a,b) => b.wins - a.wins)

    return (
        <div style={{padding:24}}>
            <h1>Player Standings</h1>
            <table border="1" cellpadding="8">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Wins</th>
                        <th>Losses</th>
                        <th>Games</th>
                        <th>Win%</th>
                        <th>Streak</th>
                    </tr>
                </thead>
                <tbody>
                    {standings.map((player, index) => (
                        <tr key={player.id}>
                            <td>{index+1}</td>
                            <td>
                                {player.name}
                                {player.nickname && `(${player.nickname})`}
                            </td>
                            <td>{player.wins}</td>
                            <td>{player.losses}</td>
                            <td>{player.gamesPlayed}</td>
                            <td>{players.winPct}</td>
                            <td>{players.streak}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
