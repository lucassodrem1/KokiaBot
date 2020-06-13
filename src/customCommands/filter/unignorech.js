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

  let guildFilterController = new GuildFilterController(message.guild.id);
  
  try{
    let checkDelete = await guildFilterController.deleteIgnoreChannel(channel.id); 

    if(!checkDelete) {
      return message.channel.send(`Este canal não está na lista dos canais ignorados pelos filtros!`);
    }

    message.channel.send(`Canal **${channel.name}** foi retirado da lista!`);
  } catch(e) {
    console.log(`Erro ao remover canal da lista ignorados.\n Comando: filter unignorech.\n Server: ${message.guild.name}\n`, e);
  }
}