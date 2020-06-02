const Discord = require("discord.js");
const GuildController = require('../controllers/Guild');
const UserController = require('../controllers/User');
const GuildFilterController = require('../controllers/GuildFilter');

module.exports = (client, guild) => {
  // Verificar disponibilidade do server.
  if(!guild.available) {
    return channel.send('Server indisponível');
  }
  
  let textChannel = guild.channels.cache.find(channel => channel.type === 'text');
  
  // Exibir mensagem quando entrar no server.
  textChannel.send(`Oi! Meu prefixo é **${client.config.prefix}**. Digite **${client.config.prefix}help** para me conhecer!`)
    .catch(console.error);

  // Salvar id da guild no db.
  let guildController = new GuildController();
  guildController.addGuild(guild.id, client.config.prefix);
  guildController.addGuildLevelSystem(guild.id, client.config);
  guildController.addGuildWelcome(guild.id, client.config);

  let guildFilterController = new GuildFilterController(guild.id);
  guildFilterController.addGuildFilter();
}