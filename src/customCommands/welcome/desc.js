const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }
  
  let description = args.join(' ');
  if(description.length > 140) return message.channel.send('A descrição só pode conter até 140 caracteres!');

  let guildController = new GuildController();
  try {
    await guildController.updateWelcome(message.guild.id, 'description', description);
    
    message.channel.send('Descrição da mensagem de boas-vindas foi alterado!');
  } catch(e) {
    console.log(`Erro ao alterar descrição welcome.\n Comando: welcome desc.\n Server: ${message.guild.name}\n`, e);
  }
}