const Discord = require("discord.js");
const { embedIgnoreChannels } = require('../../embeds/embedIgnoreChannels');

exports.run = async (client, message, args) => {
  embedIgnoreChannels(Discord, message);
}