import { supabase } from '@/lib/supabase'
import StandingsTable from './StandingsTable'

export default async function StandingsPage() {

  // GET PLAYERS
  const { data: players, error: playerError } =
    await supabase
      .from('players')
      .select('id, name, nickname')

  if (playerError) {
    return <div>Error Loading Players</div>
  }

  // GET GAMES
  const { data: games, error: gameError } =
    await supabase
      .from('games')
      .select(`
        id,
        player1_id,
        player2_id,
        player1_score,
        player2_score,
        created_at,
        game_date,
        game_video_link
      `)

  if (gameError) {
    return <div>Error Loading Games</div>
  }

  // BUILD BASE STANDINGS
  const standings = players.map(player => {

    const playerGames = games
      .filter(g =>
        g.player1_id === player.id ||
        g.player2_id === player.id
      )
      .sort((a,b) =>
        new Date(b.game_date) - new Date(a.game_date)
      )

    let wins = 0

    playerGames.forEach(game => {

      const isPlayer1 = game.player1_id === player.id

      const playerScore = isPlayer1
        ? game.player1_score
        : game.player2_score

      const opponentScore = isPlayer1
        ? game.player2_score
        : game.player1_score

      if (playerScore > opponentScore) {
        wins++
      }
    })

    const losses = playerGames.length - wins

    const winPct =
      playerGames.length > 0
        ? wins / playerGames.length
        : 0
        let streakCount = 0
        let streakType = null
        
        for (const game of playerGames) {
        
          const isPlayer1 = game.player1_id === player.id
        
          const playerScore = isPlayer1
            ? game.player1_score
            : game.player2_score
        
          const opponentScore = isPlayer1
            ? game.player2_score
            : game.player1_score
        
          const isWin = playerScore > opponentScore
        
          if (streakType === null) {
            streakType = isWin ? 'W' : 'L'
            streakCount = 1
          }
          else if (
            (isWin && streakType === 'W') ||
            (!isWin && streakType === 'L')
          ) {
            streakCount++
          }
          else {
            break
          }
        }
        
        const streak =
          streakType ? `${streakType}${streakCount}` : '-'
        
        return {
          ...player,
          wins,
          losses,
          gamesPlayed: playerGames.length,
          winPct,
          streak
        }

  })

  // CREATE LOOKUP FOR SOS
  const playerMap = {}
  standings.forEach(p => {
    playerMap[p.id] = p
  })

  // CALCULATE SOS
  standings.forEach(player => {

    const playerGames = games.filter(
      g => g.player1_id === player.id ||
           g.player2_id === player.id
    )

    if (playerGames.length === 0) {
      player.sos = 0
      return
    }

    let totalOpponentWinPct = 0

    playerGames.forEach(game => {

      const opponentId =
        game.player1_id === player.id
          ? game.player2_id
          : game.player1_id

      const opponent = playerMap[opponentId]

      if (opponent) {
        totalOpponentWinPct += opponent.winPct
      }
    })

    player.sos =
      totalOpponentWinPct / playerGames.length
  })

  // POWER SCORE
  standings.forEach(player => {
    const winWeight = 0.7
    const sosWeight = 0.3

    player.powerScore =
      player.winPct * winWeight +
      player.sos * sosWeight
  })

  // ASSIGN POWER RANK
  const powerSorted = [...standings].sort(
    (a,b) => b.powerScore - a.powerScore
  )

  powerSorted.forEach((player, index) => {
    player.powerRank = index + 1
  })

  // DEFAULT SORT BY WINS
  standings.sort((a,b) => b.wins - a.wins)

  return (
    <div className="space-y-6 px-6 py-8">
      <h1 className="text-3xl font-bold">Player Standings</h1>
      <StandingsTable standings={standings} />
    </div>
  )
}