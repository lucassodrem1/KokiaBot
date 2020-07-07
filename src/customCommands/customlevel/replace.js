const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');
const AdminController = require('../../controllers/Admin');

module.exports = {
  name: 'customlevel replace',
  description: 'Substitui ou acumula role ao subir de level.',
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

    if(!args[0]) return message.channel.send('Escolha uma opção entre **on** e **off**.');
    
    let option = args[0].toLowerCase();
    let successMessage = 'A role será substituída ao ganhar outra quando subir de level!';

    if(option === 'on') {
      option = 1;    
    } else if(option === 'off') {
      option = 0;
      successMessage = 'As roles irão acumular ao ganhar outras quando subir de level!';
    } else {
      return message.channel.send('Escolha uma opção entre **on** e **off**.');
    }

    let guildController = new GuildController();
    await guildController.updateInfo(message.guild.id, 'custom_role_replace', option);

    // Registrar log se for ação de um usuário privilegiado.
    if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
      AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
    
    message.channel.send(successMessage);
  }
}