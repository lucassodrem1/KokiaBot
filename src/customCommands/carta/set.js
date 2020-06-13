const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }
  
  let channel = message.mentions.channels.first();
    
  if(!channel) {
    return message.channel.send('Canal de texto não encontrado!');
  }

  try{
    let guildController = new GuildController();
    await guildController.updateInfo(message.guild.id, 'elegant_mail_channel', channel.id); 

    message.channel.send(`Correio elegante setado no canal **${channel.name}**!`);
  } catch(e) {
    console.log(`Erro ao setar correio eletante.\n Comando: carta set.\n Server: ${message.guild.name}\n`, e);
  }
}