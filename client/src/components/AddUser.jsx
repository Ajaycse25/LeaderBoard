import { useState } from "react";

export default function AddUser({ onAdd }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return;
    try {
      setLoading(true);
      await onAdd(name.trim());
      setName("");
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to add");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex gap-2 items-end">
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-300">Add new user</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          className="bg-gray-900 border border-gray-700 rounded-xl p-3 outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add"}
      </button>
      {error && <div className="text-red-400 text-sm ml-2">{error}</div>}
    </form>
  );
}
