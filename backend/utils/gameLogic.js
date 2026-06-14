// 分配角色
function assignRoles(game) {
  const playerCount = game.players.length;
  const werewolfCount = Math.ceil(playerCount / 3);
  const seerCount = 1;
  const doctorCount = playerCount > 6 ? 1 : 0;
  const hunterCount = playerCount > 8 ? 1 : 0;

  // 打乱数组
  const roles = [];
  for (let i = 0; i < werewolfCount; i++) roles.push('werewolf');
  for (let i = 0; i < seerCount; i++) roles.push('seer');
  for (let i = 0; i < doctorCount; i++) roles.push('doctor');
  for (let i = 0; i < hunterCount; i++) roles.push('hunter');
  while (roles.length < playerCount) roles.push('villager');

  // 随机分配
  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roles[i], roles[j]] = [roles[j], roles[i]];
  }

  game.players.forEach((player, index) => {
    player.role = roles[index];
  });
}

// 检查游戏是否结束
function checkWinCondition(game) {
  const aliveWerewolves = game.players.filter(p => p.role === 'werewolf' && p.isAlive).length;
  const aliveVillagers = game.players.filter(p => p.role !== 'werewolf' && p.isAlive).length;

  if (aliveWerewolves === 0) {
    return 'villagers';
  } else if (aliveWerewolves >= aliveVillagers) {
    return 'werewolves';
  }
  return null;
}

// 计算投票结果
function tallyVotes(game) {
  const voteCounts = {};
  game.players.forEach(player => {
    if (player.votedFor) {
      const votedId = player.votedFor.toString();
      voteCounts[votedId] = (voteCounts[votedId] || 0) + 1;
    }
  });

  let maxVotes = 0;
  let eliminatedId = null;
  for (const [id, count] of Object.entries(voteCounts)) {
    if (count > maxVotes) {
      maxVotes = count;
      eliminatedId = id;
    }
  }

  return eliminatedId;
}

module.exports = {
  assignRoles,
  checkWinCondition,
  tallyVotes
};
