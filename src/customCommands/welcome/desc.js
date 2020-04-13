const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }
  
  let description = args.join(' ');
  if(description.length > 120) return message.channel.send('A descrição só pode conter até 120 caracteres!');

  let guildController = new GuildController();
  try {
    await guildController.updateWelcome(message.guild.id, 'description', description);
    
    message.channel.send('Descrição da mensagem de boas-vindas foi alterado!');
  } catch(e) {
    console.error(e);
  }
}