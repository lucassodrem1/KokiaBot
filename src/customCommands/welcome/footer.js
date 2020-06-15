const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }
  
  let footer = args.join(' ');
  if(footer.length > 200) return message.channel.send('O footer só pode conter até 200 caracteres!');

  let guildController = new GuildController();
  try {
    await guildController.updateWelcome(message.guild.id, 'footer', footer);
    
    message.channel.send('Footer da mensagem de boas-vindas foi alterado!');
  } catch(e) {
    console.log(`Erro ao alterar footer welcome.\n Comando: welcome footer.\n Server: ${message.guild.name}\n`, e);
  }
}