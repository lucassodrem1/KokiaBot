const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');
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

  // Registrar log se for ação de um usuário privilegiado.
  if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
    AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
  
  message.channel.send(successMessage);
}