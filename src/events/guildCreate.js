const Discord = require("discord.js");
const GuildController = require('../controllers/Guild');
const GuildFilterController = require('../controllers/GuildFilter');
const message = require("./message");

module.exports = (client, guild) => {
  // Verificar disponibilidade do server.
  if(!guild.available) {
    return channel.send('Server indisponível');
  }
  
  let textChannel = guild.channels.cache.find(channel => channel.type === 'text');
  
  // Exibir mensagem quando entrar no server.
  let embed = new Discord.MessageEmbed()
      .setColor(0xf33434)
      .setAuthor(client.user.username, client.user.displayAvatarURL())
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(`Oi! Meu prefixo é **${client.config.prefix}**. Digite **${client.config.prefix}help** para me conhecer!\n\n Se gostar, [vote em mim para me ajudar!](https://top.gg/bot/695267877892259890/vote)`)

  message.channel.send({embed: embed});
  // Salvar id da guild no db.
  let guildController = new GuildController();
  guildController.addGuild(guild.id, client.config.prefix);
  guildController.addGuildLevelSystem(guild.id, client.config);
  guildController.addGuildWelcome(guild.id, client.config);

  let guildFilterController = new GuildFilterController(guild.id);
  guildFilterController.addGuildFilter();
}