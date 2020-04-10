const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para alterar o canal da mensagem!');
  }
  
  channelId = args[0].substring(2, args[0].length - 1);
  // Pega o channel referente ao escolhido pelo usuário.
  let channel = message.member.guild.channels.cache.find(channel => channel.id == channelId);
  
  if(!channel) {
    return message.channel.send('Canal de texto não encontrado!');
  }

  let guildId = message.member.guild.id;
  let guildController = new GuildController();
  await guildController.updateSystemLevel(guildId, 'level_up_channel', channel.id);
  
  message.channel.send('Canal alterado com sucesso!');
}