const Discord = require("discord.js");
const { embedMaestryRole } = require('../../embeds/embedMaestryRole');

module.exports = {
  name: 'lolrole show',
  description: 'Exibe as roles dadas por maestria no servidor.',
  category: '🎮 Jogos',
  async run(client, message, args) {
    embedMaestryRole(Discord, message);
  }
}