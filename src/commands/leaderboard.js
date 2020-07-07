const Discord = require("discord.js");
const { embedLeaderboard } = require('../embeds/embedLeaderboard');

module.exports = {
  name: 'leaderboard',
  description: 'Exibe a classificação dos membros no servidor.',
  category: '🧙 XP & Leveling',
  aliases: ['leader'],
  run(client, message, args) {
    embedLeaderboard(Discord, message);
  }
}