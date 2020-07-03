const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');
const AdminController = require('../../controllers/Admin');
let Parser = require('rss-parser');
let parser = new Parser();

const availablePlat = [
  'twitch',
  'youtube'
];

exports.run = async (client, message, args) => {
  // Pegar usuários privilegiados.
  let privilegedUsers = await AdminController.getPrivilegedUsers();
  let isPrivilegedUser = privilegedUsers.find(privilegedUser => privilegedUser.user_id == message.author.id);

  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    // Verificar se é usuário privilegiado.
    if(!isPrivilegedUser) return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }

  let platform = args[0];
  if(!platform) return message.channel.send('Escolha uma plataforma entre: twitch, youtube e twitter.');
 
  if(!availablePlat.find(plat => plat == platform)) return message.channel.send('Escolha uma plataforma entre: twitch, youtube.');

  let guildController = new GuildController();
  // Verificar se é pra remover canal.
  if(args[1] == 'off') {
    await guildController.updateInfo(message.guild.id, platform+'_channel', 0);
    return message.channel.send(`Publicações de **${platform}** foram desabilitadas.`);
  }

  let channel = message.mentions.channels.first();
  if(!channel) return message.channel.send('Escolha um canal de texto.');
  
  try {
    // Se a plataforma for youtube, pegar socais da guild para dar update nas dates.
    if(platform == 'youtube') {
      let guildSocial = await guildController.getGuildSocialByGuild(message.guild.id, platform);

      // Atualizar todos as dates das sociais do youtube que estão registrados no servidor.
      guildSocial.forEach(async social => {
        if(social.platform == 'youtube') {
          let feed = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${social.username}`)
            .catch(e => {
              message.channel.send(`Erro ao atualizar informações do canal do youtube com id **${social.username}**.`);
            });
    
          if(!feed) return;
          await guildController.updateGuildSocial(social, 'date', feed.items[0].pubDate);
        }
      });
    }

    await guildController.updateInfo(message.guild.id, platform+'_channel', channel.id);

    // Registrar log se for ação de um usuário privilegiado.
    if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
      AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

    message.channel.send(`Publicações de **${platform}** aparecerão em ${channel.name}!`);
  } catch(e) {
    console.log(`Erro ao setar canal.\n Comando: social channel.\n Server: ${message.guild.name}\n`, e);
  }
}