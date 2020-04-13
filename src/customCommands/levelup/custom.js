const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }
  
  if(!args[0]) {
    return message.channel.send('Escolha uma mensagem!');
  }

  text = args.join(' ');
  let guildId = message.member.guild.id;
  let guildController = new GuildController();
  await guildController.updateSystemLevel(guildId, 'level_up_message', text);
  
  message.channel.send('Mensagem ao subir de level foi alterada com sucesso!');
}