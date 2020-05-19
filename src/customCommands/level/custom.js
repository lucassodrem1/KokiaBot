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
  
  let guildController = new GuildController();
  let guildId = message.member.guild.id;
  
  if(args[0] === 'default') {
    let text = client.config.system_level.level_up_message;
    await guildController.updateSystemLevel(guildId, 'level_up_message', text);

    return message.channel.send('Mensagem ao subir de level foi alterada com sucesso!');
  }

  text = args.join(' ');
  await guildController.updateSystemLevel(guildId, 'level_up_message', text);
  
  message.channel.send('Mensagem ao subir de level foi alterada com sucesso!');
}