const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }
  
  let guildController = new GuildController();

  try {
    await guildController.updateInfo(message.guild.id, 'blacklist_role', 0);

    message.channel.send('Mute role removida!');
  } catch(e) {
    console.log(`Erro ao remover unmute role.\n Comando: level unmuterole.\n Server: ${message.guild.name}\n`, e);
  }
}