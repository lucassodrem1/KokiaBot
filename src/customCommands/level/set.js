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

  let member = message.mentions.members.first();
  
  if(!member) return message.channel.send('Especifique um usuário!');
  
  if(member.user.bot) return message.channel.send('Usuário não pode ser um bot!');

  let newLevel = args[1];
  if(!newLevel) return message.channel.send('Especifique um level!');

  try {
    let updatedUser = await userController.setUserLevelById(message.guild.id, member.id, args[1]);
    if(!updatedUser) return message.channel.send('Usuário não foi encontrado!');

    // Registrar log se for ação de um usuário privilegiado.
    if(isPrivilegedUser && message.author.id !== message.guild.ownerID) 
      AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

    return message.channel.send(`Level de **${member.displayName}** foi setado para **${args[1]}**!`);
  } catch(e) {
    message.channel.send('Usuário é um bot ou não foi encontrado!');
    console.log(`Erro ao setar level de um usuário.\n Comando: level set.\n Server: ${message.guild.name}\n`, e);
  }
}