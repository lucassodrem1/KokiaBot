const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }

  let command = args[0];
  if(!command) return message.channel.send('Escolha um comando.');
  
  let guildController = new GuildController();
  try {
    let checkDelete = await guildController.removeCustomCommand(message.guild.id, command);
    
    // Verificar se conta foi deletada.
    if(!checkDelete) return message.channel.send(`Comando **${command}** não existe!`);

    message.channel.send(`Comando **${command}** foi removido!`);
  } catch(e) {
    console.log(`Erro ao remover custom command.\n Comando: command remove.\n Server: ${message.guild.name}\n`, e);
  }
}