const Discord = require("discord.js");
const GuildController = require('../controllers/Guild');
const UserController = require('../controllers/User');

module.exports = (client, guild) => {
  // Verificar disponibilidade do server.
  if(!guild.available) {
    return channel.send('Server indisponível');
  }

  // Remover informações do server do db.
  // Consequentemente remove os membros desse server.
  let guildController = new GuildController();
  guildController.deleteGuild(guild.id);
}