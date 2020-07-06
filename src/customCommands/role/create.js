const Discord = require("discord.js");
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

  let roleName = args.splice(0, args.length - 1).join(' ');
  let roleColor = args.join('');

  if(!roleName) return message.channel.send('Escolha o nome da role.');

  if(!roleColor) return message.channel.send('Escolha a cor da role.');

  try{
    await message.guild.roles.create({
      data: {
        name: roleName,
        color: roleColor
      }
    });

    // Registrar log se for ação de um usuário privilegiado.
    if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
      AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

    message.channel.send(`Role **${roleName}** foi criada!`);
  } catch(e) {
    console.log(`Erro ao criar role.\n Comando: role create.\n Server: ${message.guild.name}\n`, e);
  }
}