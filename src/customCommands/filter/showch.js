const Discord = require("discord.js");
const { embedIgnoreChannels } = require('../../embeds/embedIgnoreChannels');

module.exports = {
  name: 'filter showch',
  description: 'Exibe canais na white list de filtros.',
  category: '👮‍♀️ Moderação',
  async run(client, message, args) {
    embedIgnoreChannels(Discord, message);
  }
}