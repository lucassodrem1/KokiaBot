const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

const availablePlat = [
  'twitch',
  'youtube',
  'twitter'
];

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }

  let platform = args[0];
  if(!platform) return message.channel.send('Escolha uma plataforma entre: twitch, youtube e twitter.');
 
  if(!availablePlat.find(plat => plat == platform)) return message.channel.send('Escolha uma plataforma entre: twitch, youtube e twitter.');

  let username = args[1];
  if(!username) return message.channel.send('Digite seu usuário.');
  
  
  let guildController = new GuildController();
  try {
    let checkDelete = await guildController.removeGuildSocial(message.guild.id, username, platform);
    // Verificar se conta foi deletada.
    if(!checkDelete) return message.channel.send(`Conta em **${platform}** de **${username}** não existe!`);

    message.channel.send(`Conta em **${platform}** de **${username}** foi removida!`);
  } catch(e) {
    console.log(`Erro ao remover user.\n Comando: social remove.\n Server: ${message.guild.name}\n`, e);
  }
}