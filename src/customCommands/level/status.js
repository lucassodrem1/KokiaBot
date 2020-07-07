const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');
const AdminController = require('../../controllers/Admin');

module.exports = {
  name: 'level status',
  description: 'Define o status do sistema de level no servidor.',
  category: '🧙 XP & Leveling',
  usage: '<on/off>',
  permission: 'Administrador',
  async run(client, message, args) {
    // Pegar usuários privilegiados.
    let privilegedUsers = await AdminController.getPrivilegedUsers();
    let isPrivilegedUser = privilegedUsers.find(privilegedUser => privilegedUser.user_id == message.author.id);

    // Verificar se usuário é um administrador.
    if(!message.member.hasPermission('ADMINISTRATOR')) {
      // Verificar se é usuário privilegiado.
      if(!isPrivilegedUser) return message.channel.send('Você precisa ser um administrador para usar este comando!');
    }
    
    let option = args[0].toLowerCase();
    let successMessage = 'Sistema de level ativado!';

    if(option === 'on') {
      option = 1;    
    } else if(option === 'off') {
      option = 0;
      successMessage = 'Sistema de level desativado!';
    } else {
      return message.channel.send('Escolha uma opção entre **on** e **off**.');
    }

    let guildController = new GuildController();
    await guildController.updateSystemLevel(message.guild.id, 'status', option);

    // Registrar log se for ação de um usuário privilegiado.
    if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
      AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
    
    message.channel.send(successMessage);
  }
}