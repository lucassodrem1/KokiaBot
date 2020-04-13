const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }
  
  try {
    let guildController = new GuildController();

    if(args[0] === 'default') {
      await guildController.updateWelcome(message.guild.id, 'channel', 0);
      return message.channel.send('Mensagem de boas-vindas será mostrado no primeiro canal de texto!');
    }

    let channel = message.mentions.channels.first();
    
    if(!channel) {
      return message.channel.send('Canal de texto não encontrado!');
    }

    await guildController.updateWelcome(message.guild.id, 'channel', channel.id);
    
    message.channel.send(`Mensagem de boas-vindas agora irá aparecer em **${channel.name}**!`);
  } catch(e) {
    console.error(e);
  }
}