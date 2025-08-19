export default function Leaderboard({ entries }) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-3">Leaderboard</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-xl border border-gray-700">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="p-3">Rank</th>
              <th className="p-3">Name</th>
              <th className="p-3">Total Points</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e._id} className="border-t border-gray-800 hover:bg-gray-800/50">
                <td className="p-3">{e.rank}</td>
                <td className="p-3">{e.name}</td>
                <td className="p-3">{e.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
