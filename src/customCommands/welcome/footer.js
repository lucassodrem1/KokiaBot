const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }
  
  let footer = args.join(' ');
  if(footer.length > 80) return message.channel.send('A descrição só pode conter até 80 caracteres!');

  let guildController = new GuildController();
  try {
    await guildController.updateWelcome(message.guild.id, 'footer', footer);
    
    message.channel.send('Footer da mensagem de boas-vindas foi alterado!');
  } catch(e) {
    console.error(e);
  }
}