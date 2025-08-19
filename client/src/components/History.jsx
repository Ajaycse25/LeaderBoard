export default function History({ items }) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-3">Claim History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-xl border border-gray-700">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="p-3">When</th>
              <th className="p-3">User</th>
              <th className="p-3">Points</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id} className="border-t border-gray-800 hover:bg-gray-800/50">
                <td className="p-3">{new Date(it.createdAt).toLocaleString()}</td>
                <td className="p-3">{it.user?.name || it.user}</td>
                <td className="p-3">{it.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
