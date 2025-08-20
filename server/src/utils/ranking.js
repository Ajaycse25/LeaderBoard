
export function assignRanks(sortedUsers) {
  let prevPoints = null;
  let currentRank = 0;
  return sortedUsers.map((u, idx) => {
    if (u.totalPoints !== prevPoints) {
      currentRank = idx + 1; 
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
