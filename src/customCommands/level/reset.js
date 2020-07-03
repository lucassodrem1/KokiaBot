const Discord = require("discord.js");
const UserController = require('../../controllers/User');
const AdminController = require('../../controllers/Admin');

exports.run = async (client, message, args) => {
  // Pegar usuários privilegiados.
  let privilegedUsers = await AdminController.getPrivilegedUsers();
  let isPrivilegedUser = privilegedUsers.find(privilegedUser => privilegedUser.user_id == message.author.id);

  // Verificar se usuário tem permissão.
  if(message.author.id !== message.guild.ownerID) {
    // Verificar se é usuário privilegiado.
    if(!isPrivilegedUser) return message.channel.send('Você precisa ser o proprietário do servidor para usar este comando!');
  }

  let userController = new UserController();

  if(args[0] === 'all') {
    try {
      await userController.resetAllUsers(message.guild.id);

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && message.author.id !== message.guild.ownerID) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
      
      return message.channel.send('Level de todos os usuários foram resetados!');
    } catch(e) {
      console.error(e);
      message.channel.send('Algo deu errado! Tente novamente.');
    }
  }

  let member = message.mentions.members.first();

  if(!member) {
    return message.channel.send('Especifique um usuário ou use **all** para resetar de todos.');
  }

  try {
    await userController.resetUserById(message.guild.id, member.id);

    // Registrar log se for ação de um usuário privilegiado.
    if(isPrivilegedUser && message.author.id !== message.guild.ownerID) 
      AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

    return message.channel.send(`Level de **${member.nickname}** foi resetado!`);
  } catch(e) {
    message.channel.send('Usuário é um bot ou não foi encontrado!');
    console.log(`Erro ao resetar level do usuario.\n Comando: level reset.\n Server: ${message.guild.name}\n`, e);
  }
}