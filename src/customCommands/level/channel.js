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
    let guildId = message.member.guild.id;

    if(args[0] === 'default') {
      await guildController.updateSystemLevel(guildId, 'level_up_channel', 0);

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

      return message.channel.send('Mensagem agora será mostrada no canal que o usuário estiver!');
    }

    let channel = message.mentions.channels.first();
    
    if(!channel) {
      return message.channel.send('Canal de texto não encontrado!');
    }

    await guildController.updateSystemLevel(guildId, 'level_up_channel', channel.id);

    // Registrar log se for ação de um usuário privilegiado.
    if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
      AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
    
    message.channel.send('Canal alterado com sucesso!');
  } catch(e) {
    console.log(`Erro ao trocar canal de aviso de up.\n Comando: level channel.\n Server: ${message.guild.name}\n`, e);
  }
}