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
  
  let channel = message.mentions.channels.first();
    
  if(!channel) {
    return message.channel.send('Canal de texto não encontrado!');
  }

  try{
    let guildController = new GuildController();
    await guildController.updateInfo(message.guild.id, 'elegant_mail_channel', channel.id); 

    // Registrar log se for ação de um usuário privilegiado.
    if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
      AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

    message.channel.send(`Correio elegante setado no canal **${channel.name}**!`);
  } catch(e) {
    console.log(`Erro ao setar correio eletante.\n Comando: carta set.\n Server: ${message.guild.name}\n`, e);
  }
}