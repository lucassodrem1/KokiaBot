const Discord = require("discord.js");
const { embedCustomLevel } = require('../../embeds/embedCustomLevel');

module.exports = {
  name: 'customlevel show',
  description: 'Mostra todos os levels customizados no servidor.',
  category: '🧙 XP & Leveling',
  async run(client, message, args) {
    embedCustomLevel(Discord, message);
  }
}