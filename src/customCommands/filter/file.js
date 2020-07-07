const Discord = require("discord.js");
const GuildFilterController = require('../../controllers/GuildFilter');
const AdminController = require('../../controllers/Admin');

exports.run = async (client, message, args) => {
  try {
    // Pegar usuários privilegiados.
    let privilegedUsers = await AdminController.getPrivilegedUsers();
    let isPrivilegedUser = privilegedUsers.find(privilegedUser => privilegedUser.user_id == message.author.id);

    // Verificar se usuário é um administrador.
    if(!message.member.hasPermission('ADMINISTRATOR')) {
      // Verificar se é usuário privilegiado.
      if(!isPrivilegedUser) return await message.channel.send('Você precisa ser um administrador para usar este comando!');
    }
    
    let option = args[0].toLowerCase();
    let successMessage = 'Filtro de arquivo ativado!';

    if(option === 'on') {
      option = 1;    
    } else if(option === 'off') {
      option = 0;
      successMessage = 'Filtro de arquivo desativado!';
    } else {
      return await message.channel.send('Escolha uma opção entre **on** e **off**.');
    }

    let guildFilterController = new GuildFilterController(message.guild.id);
    await guildFilterController.updateInfo('filter_attach', option);

    // Registrar log se for ação de um usuário privilegiado.
    if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
      AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
    
    await message.channel.send(successMessage);
  } catch(e) {
    if(e.message !== 'Missing Permissions')
      console.log(`Erro filtrar file.\n Comando: filter file.\n Server: ${message.guild.name}\n`, e);
  }
}