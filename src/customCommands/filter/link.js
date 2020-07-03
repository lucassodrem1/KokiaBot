const Discord = require("discord.js");
const GuildFilterController = require('../../controllers/GuildFilter');
const AdminController = require('../../controllers/Admin');

exports.run = async (client, message, args) => {
  // Pegar usuários privilegiados.
  let privilegedUsers = await AdminController.getPrivilegedUsers();
  let isPrivilegedUser = privilegedUsers.find(privilegedUser => privilegedUser.user_id == message.author.id);

  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    // Verificar se é usuário privilegiado.
    if(!isPrivilegedUser) return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }
  
  let option = args[0].toLowerCase();
  let successMessage = 'Filtro de link ativado!';

  if(option === 'on') {
    option = 1;    
  } else if(option === 'off') {
    option = 0;
    successMessage = 'Filtro de link desativado!';
  } else {
    return message.channel.send('Escolha uma opção entre **on** e **off**.');
  }

  let guildFilterController = new GuildFilterController(message.guild.id);
  await guildFilterController.updateInfo('filter_link', option);

  // Registrar log se for ação de um usuário privilegiado.
  if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
    AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
  
  message.channel.send(successMessage);
}