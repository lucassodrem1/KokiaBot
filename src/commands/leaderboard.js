const Discord = require("discord.js");
const UserController = require('../controllers/User');
const { embedLeaderboard } = require('../embeds/embedLeaderboard');

exports.run = async (client, message, args) => {
  embedLeaderboard(Discord, message);
}