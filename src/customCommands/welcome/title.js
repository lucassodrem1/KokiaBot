const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }
  
  let title = args.join(' ');
  if(title.length > 60) return message.channel.send('O título só pode conter até 60 caracteres!');

  let guildController = new GuildController();
  try {
    await guildController.updateWelcome(message.guild.id, 'title', title);
    
    message.channel.send('Título da mensagem de boas-vindas foi alterado!');
  } catch(e) {
    console.log(`Erro ao alterar título welcome.\n Comando: welcome title.\n Server: ${message.guild.name}\n`, e);
  }
}