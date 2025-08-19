export default function UserSelect({ users, selectedUserId, onChange }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm text-gray-300">Select user</label>
      <select
        value={selectedUserId || ""}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-900 border border-gray-700 rounded-xl p-3 outline-none"
      >
        <option value="" disabled>-- pick a user --</option>
        {users.map(u => (
          <option key={u._id} value={u._id}>{u.name}</option>
        ))}
      </select>
    </div>
  )
}
