const Discord = require("discord.js");
const { embedGuildInfo } = require('../embeds/embedGuildInfo');

exports.run = async (client, message, args) => {
  embedGuildInfo(Discord, message);
}