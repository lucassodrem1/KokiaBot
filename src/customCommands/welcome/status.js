const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }
  
  let option = args[0].toLowerCase();
  let successMessage = 'Mensagem de boas-vindas ativada!';

  if(option === 'on') {
    option = 1;    
  } else if(option === 'off') {
    option = 0;
    successMessage = 'Mensagem de boas-vindas desativada!';
  } else {
    return message.channel.send('Escolha um opção entre **on** e **off**.');
  }

  let guildController = new GuildController();
  await guildController.updateWelcome(message.guild.id, 'status', option);
  message.channel.send(successMessage);
}