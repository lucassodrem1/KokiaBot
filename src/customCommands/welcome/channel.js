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
  
  try {
    let guildController = new GuildController();

    if(args[0] === 'default') {
      await guildController.updateWelcome(message.guild.id, 'channel', 0);

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
      
      return message.channel.send('Mensagem de boas-vindas será mostrado no primeiro canal de texto!');
    }

    let channel = message.mentions.channels.first();
    
    if(!channel) {
      return message.channel.send('Canal de texto não encontrado!');
    }

    await guildController.updateWelcome(message.guild.id, 'channel', channel.id);

    // Registrar log se for ação de um usuário privilegiado.
    if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
      AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
    
    message.channel.send(`Mensagem de boas-vindas agora irá aparecer em **${channel.name}**!`);
  } catch(e) {
    console.log(`Erro ao alterar canal welcome.\n Comando: welcome channel.\n Server: ${message.guild.name}\n`, e);
  }
}