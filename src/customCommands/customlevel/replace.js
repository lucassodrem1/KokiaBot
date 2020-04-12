const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para alterar o canal da mensagem!');
  }
  
  let option = args[0].toLowerCase();
  let successMessage = 'A role será substituída ao ganhar outra quando subir de level!';

  if(option === 'on') {
    option = 1;    
  } else if(option === 'off') {
    option = 0;
    successMessage = 'As roles irão acumular ao ganhar outras quando subir de level!';
  } else {
    return message.channel.send('Escolha um opção entre **on** e **off**.');
  }

  let guildController = new GuildController();
  await guildController.updateInfo(message.guild.id, 'custom_role_replace', option);
  message.channel.send(successMessage);
}