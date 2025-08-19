import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import { socket } from "./socket";

import UserSelect from "./components/UserSelect";
import AddUser from "./components/AddUser";
import ClaimPanel from "./components/ClaimPanel";
import Leaderboard from "./components/Leaderboard";
import History from "./components/History";

export default function App() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [history, setHistory] = useState([]);
  const [lastResult, setLastResult] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    const res = await api.get("/api/users");
    setUsers(res.data);
    if (!selectedUserId && res.data.length) setSelectedUserId(res.data[0]._id);
  }

  async function loadLeaderboard() {
    const res = await api.get("/api/users/leaderboard");
    setLeaderboard(res.data);
  }

  async function loadHistory(userId) {
    const url = userId ? `/api/claim/history?userId=${userId}` : "/api/claim/history";
    const res = await api.get(url);
    setHistory(res.data);
  }

  useEffect(() => {
    (async () => {
      await Promise.all([loadUsers(), loadLeaderboard(), loadHistory(selectedUserId)]);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!selectedUserId) return;
    loadHistory(selectedUserId);
  }, [selectedUserId]);

  useEffect(() => {
    socket.on("leaderboard:update", (data) => {
      setLeaderboard(data);
    });
    socket.on("history:new", (item) => {
      setHistory((prev) => {
        if (!selectedUserId || item.user === selectedUserId) {
          const readable = {
            ...item,
            user: users.find((u) => u._id === item.user) || item.user,
          };
          return [readable, ...prev].slice(0, 100);
        }
        return prev;
      });
    });
    return () => {
      socket.off("leaderboard:update");
      socket.off("history:new");
    };
  }, [selectedUserId, users]);

  const selectedUser = useMemo(
    () => users.find((u) => u._id === selectedUserId),
    [users, selectedUserId]
  );

  async function handleAddUser(name) {
    const res = await api.post("/api/users", { name });
    setUsers((prev) => [...prev, res.data]);
  }

  async function handleClaim() {
    if (!selectedUserId) return;
    const res = await api.post("/api/claim", { userId: selectedUserId });
    setLastResult(res.data);
    await loadUsers();
  }

  if (loading) {
    return (
      <div className="p-6 bg-gray-900 text-gray-100 min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-5">
          <h1 className="text-3xl font-bold text-white tracking-wide">
            🎯 Leaderboard — Random Points
          </h1>
          <AddUser onAdd={handleAddUser} />
        </header>

        {/* Main content */}
        <div className="grid md:grid-cols-3 gap-6 mt-5">
          {/* Left sidebar */}
          <div className="col-span-1 space-y-4">
            <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
              <UserSelect
                users={users}
                selectedUserId={selectedUserId}
                onChange={setSelectedUserId}
              />
            </div>
            <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
              <ClaimPanel
                onClaim={handleClaim}
                selectedUserId={selectedUserId}
                lastResult={lastResult}
              />
            </div>
          </div>

          {/* Right content */}
          <div className="col-span-2 space-y-6">
            <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
              <Leaderboard entries={leaderboard} />
            </div>
            <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
              <History items={history} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
