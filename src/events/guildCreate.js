const Discord = require("discord.js");
const GuildController = require('../controllers/Guild');
const UserController = require('../controllers/User');

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

  // Salvar id de todos os membros do server que não sejam bots no db.
  let userController = new UserController();
  guild.members.cache.forEach(member => {
    if (!member.user.bot) {
      userController.addUser(guild.id, member.id);
    }
  });
}