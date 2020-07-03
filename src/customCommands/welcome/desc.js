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
  
  let description = args.join(' ');
  if(description.length > 600) return message.channel.send('A descrição só pode conter até 600 caracteres!');

  let guildController = new GuildController();
  try {
    await guildController.updateWelcome(message.guild.id, 'description', description);

    // Registrar log se for ação de um usuário privilegiado.
    if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
      AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
    
    message.channel.send('Descrição da mensagem de boas-vindas foi alterado!');
  } catch(e) {
    console.log(`Erro ao alterar descrição welcome.\n Comando: welcome desc.\n Server: ${message.guild.name}\n`, e);
  }
}