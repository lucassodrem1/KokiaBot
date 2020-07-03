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
  
  let role = message.mentions.roles.first();

  if(!role) {
    return message.channel.send('Você precisa escolher uma role!');
  }
  
  let guildController = new GuildController();
  await guildController.updateInfo(message.guild.id, 'join_role', role.id);

  // Registrar log se for ação de um usuário privilegiado.
  if(isPrivilegedUser) AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

  message.channel.send('Auto role quando usuário entrar definida!');
}