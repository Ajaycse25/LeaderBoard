// Assign ranks to users already sorted by totalPoints desc.
// Users with same totalPoints share the same rank.
export function assignRanks(sortedUsers) {
  let prevPoints = null;
  let currentRank = 0;
  return sortedUsers.map((u, idx) => {
    if (u.totalPoints !== prevPoints) {
      currentRank = idx + 1; // competition ranking
      prevPoints = u.totalPoints;
    }
    return {
      _id: u._id,
      name: u.name,
      totalPoints: u.totalPoints,
      rank: currentRank,
    };
  });
}
