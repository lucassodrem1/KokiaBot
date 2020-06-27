const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  let guildController = new GuildController();
  
  try {
    let guildData = await guildController.getGuild(message.guild.id);
    let twitchChannel = guildData.twitch_channel ? message.guild.channels.cache.find(channel => channel.id === guildData.twitch_channel).name : 'OFF';
    let youtubeChannel = guildData.youtube_channel ? message.guild.channels.cache.find(channel => channel.id === guildData.youtube_channel).name : 'OFF';

    let  allGuildSocial= [];
    // Pegar socias da twitch do servidor.
    let guildTwitchSocial = await guildController.getGuildSocialByGuild(message.guild.id, 'twitch'); 
    allGuildSocial.push(guildTwitchSocial);
    // Pegar socias do youtube do servidor.
    let guildYoutubeSocial = await guildController.getGuildSocialByGuild(message.guild.id, 'youtube'); 
    allGuildSocial.push(guildYoutubeSocial);

    allGuildSocial = allGuildSocial.map(socials => {
      return socials.map(social => {
        return [`Usuário: ${social.username} | Plataforma: ${social.platform}`];
      });
    });

    let embed = new Discord.MessageEmbed()
      .setTitle('Configurações de socias do servidor.')
      .addField('**Canal de publicações da twitch**', `\`\`\`${twitchChannel}\`\`\``, true)
      .addField('**Canal de publicações do youtube**', `\`\`\`${youtubeChannel}\`\`\``, true)
      .addField('**Contas cadastradas**', `\`\`\`${allGuildSocial.join('\n')}\`\`\``, false);

    message.channel.send({embed: embed});
  } catch(e) {
    console.log(`Erro ao mostrar embed.\n Comando: info filters.\n Server: ${message.guild.name}\n`, e);
  }
}