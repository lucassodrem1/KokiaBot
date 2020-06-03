const Discord = require("discord.js");
const GuildFilterController = require('../../controllers/GuildFilter');

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
    let guildFilterController = new GuildFilterController(message.guild.id);
    await guildFilterController.addIgnoreChannel(channel.id); 

    message.channel.send(`Canal **${channel.name}** irá ignorar todos os filtros!`);
  } catch(e) {
    message.channel.send('Este canal já está na lista!');
    console.error(e);
  }
}