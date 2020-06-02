const Discord = require("discord.js");
const GuildFilterController = require('../../controllers/GuildFilter');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }
  
  let option = args[0].toLowerCase();
  let successMessage = 'Filtro de arquivo ativado!';

  if(option === 'on') {
    option = 1;    
  } else if(option === 'off') {
    option = 0;
    successMessage = 'Filtro de arquivo desativado!';
  } else {
    return message.channel.send('Escolha uma opção entre **on** e **off**.');
  }

  let guildFilterController = new GuildFilterController(message.guild.id);
  await guildFilterController.updateInfo('filter_attach', option);
  message.channel.send(successMessage);
}