const Discord = require("discord.js");
const GuildController = require("../controllers/Guild");

module.exports = (client, guild) => {
  // Verificar disponibilidade do server.
  if (!guild.available) return;

  // Remover informações do server do db.
  let guildController = new GuildController();
  guildController.deleteGuild(guild.id);
};
