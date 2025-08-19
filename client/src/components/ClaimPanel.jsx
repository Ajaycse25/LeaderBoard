export default function ClaimPanel({ onClaim, selectedUserId, lastResult }) {
  return (
    <div className="flex flex-col gap-3">
      <button
        disabled={!selectedUserId}
        onClick={onClaim}
        className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
      >
        Claim Random Points
      </button>
      {lastResult && (
        <div className="text-sm text-gray-300">
          Awarded <span className="font-semibold">{lastResult.points}</span> points to{" "}
          <span className="font-semibold">{lastResult.user?.name}</span> (Total:{" "}
          <span className="font-semibold">{lastResult.user?.totalPoints}</span>)
        </div>
      )}
    </div>
  );
}
