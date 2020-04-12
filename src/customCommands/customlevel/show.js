const Discord = require("discord.js");
const { embedCustomLevel } = require('../../embeds/embedCustomLevel');

exports.run = async (client, message, args) => {
  embedCustomLevel(Discord, message);
}