const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }

  let command = args[0];
  if(!command) return message.channel.send('Você precisar escolher um comando.');
  if(command.length > 10) return message.channel.send('Comando só pode ter até 10 caracteres.');

  let response = args.splice(1).join(' ');
  if(!response) return message.channel.send('Você precisar escolher uma resposta.');
  if(response.length > 300) return message.channel.send('Resposta do comando só pode ter até 300 caracteres.');

  let guildController = new GuildController();
  try {
    let guildCustomCommands = await guildController.getCustomCommandsByGuild(message.guild.id);
    
    // Verificar se já existe esse comando no servidor.
    if(!guildCustomCommands.find(customCommand => customCommand.command == command)) {
      // Verificar se servidor já ultrapassou o limite de custom commands criados.
      if(guildCustomCommands.length == 20) return message.channel.send('Este servidor já possui 20 comandos customizados.');
    }

    await guildController.addCustomCommand(message.guild.id, command.toLowerCase(), response);

    message.channel.send(`Comando **${command}** foi adicionado no servidor!`);
  } catch(e) {
    console.log(`Erro ao adicionar custom command.\n Comando: command add.\n Server: ${message.guild.name}\n`, e);
  }
}