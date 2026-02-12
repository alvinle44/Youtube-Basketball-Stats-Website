'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function StandingsTable({ standings }) {

  const [sortType, setSortType] = useState('original')

  let sortedStandings = [...standings]

  if (sortType === 'power') {
    sortedStandings.sort((a,b) => b.powerScore - a.powerScore)
  } else {
    sortedStandings.sort((a,b) => b.wins - a.wins)
  }

  return (
    <div className="space-y-4">

      {/* SORT BUTTONS */}
      <div className="flex gap-3">
        <button
          onClick={() => setSortType('original')}
          className={`px-4 py-2 rounded-md text-sm ${
            sortType === 'original'
              ? 'bg-yellow-400 text-black font-semibold'
              : 'bg-zinc-800 hover:bg-zinc-700'
          }`}
        >
          Original Rank
        </button>

        <button
          onClick={() => setSortType('power')}
          className={`px-4 py-2 rounded-md text-sm ${
            sortType === 'power'
              ? 'bg-yellow-400 text-black font-semibold'
              : 'bg-zinc-800 hover:bg-zinc-700'
          }`}
        >
          Power Rank
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="overflow-x-auto bg-zinc-950 rounded-xl border border-zinc-800">

        <table className="min-w-full text-sm text-left">

          <thead className="bg-zinc-900 text-zinc-400 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Player</th>
              <th className="px-4 py-3 text-center">W</th>
              <th className="px-4 py-3 text-center">L</th>
              <th className="px-4 py-3 text-center">GP</th>
              <th className="px-4 py-3 text-center">Win%</th>
              <th className="px-4 py-3 text-center">SOS</th>
              <th className="px-4 py-3 text-center">STRK</th>
              <th className="px-4 py-3 text-center">Power</th>
            </tr>
          </thead>

          <tbody>
            {sortedStandings.map((player, index) => (
              <tr
                key={player.id}
                className={`
                  transition
                  ${index % 2 === 0
                    ? "bg-zinc-900/60"
                    : "bg-zinc-900/30"}
                  hover:bg-zinc-800
                `}
              >
                <td className="px-4 py-3 font-semibold gold-text">
                  {index + 1}
                </td>

                <td className="px-4 py-3">
                <Link
                  href={`/players/${player.id}`}
                  className="hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                >
                    {player.nickname
                      ? `${player.name} (${player.nickname})`
                      : player.name}
                  </Link>
                </td>

                <td className="px-4 py-3 text-center">
                  {player.wins}
                </td>

                <td className="px-4 py-3 text-center">
                  {player.losses}
                </td>

                <td className="px-4 py-3 text-center">
                  {player.gamesPlayed}
                </td>

                <td className="px-4 py-3 text-center">
                  {(player.winPct * 100).toFixed(1)}%
                </td>

                <td className="px-4 py-3 text-center">
                  {(player.sos * 100).toFixed(1)}%
                </td>
                <td className={`px-4 py-3 text-center font-semibold ${
                  player.streak?.startsWith('W')
                    ? "text-green-400"
                    : player.streak?.startsWith('L')
                      ? "text-red-400"
                      : "text-zinc-400"
                }`}>
                  {player.streak}
                </td>

                <td className="px-4 py-3 text-center">
                  {player.powerRank}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  )
}