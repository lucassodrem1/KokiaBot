const Discord = require("discord.js");
const { embedMaestryRole } = require('../../embeds/embedMaestryRole');

exports.run = async (client, message, args) => {
  embedMaestryRole(Discord, message);
}