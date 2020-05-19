const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }
  
  try {
    let guildController = new GuildController();
    let guildId = message.member.guild.id;

    if(args[0] === 'default') {
      await guildController.updateSystemLevel(guildId, 'level_up_channel', 0);
      return message.channel.send('Mensagem agora será mostrada no canal que o usuário estiver!');
    }

    let channel = message.mentions.channels.first();
    
    if(!channel) {
      return message.channel.send('Canal de texto não encontrado!');
    }

    await guildController.updateSystemLevel(guildId, 'level_up_channel', channel.id);
    
    message.channel.send('Canal alterado com sucesso!');
  } catch(e) {
    console.error(e);
  }
}