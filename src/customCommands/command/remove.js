const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');
const AdminController = require('../../controllers/Admin');

module.exports = {
  name: 'command remove',
  description: 'Remove um comando customizado.',
  category: '👷‍♀️ Comandos customizados',
  usage: '<comando>',
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

    let command = args[0];
    if(!command) return message.channel.send('Escolha um comando.');
    
    let guildController = new GuildController();
    try {
      let checkDelete = await guildController.removeCustomCommand(message.guild.id, command);
      
      // Verificar se conta foi deletada.
      if(!checkDelete) return message.channel.send(`Comando **${command}** não existe!`);

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

      message.channel.send(`Comando **${command}** foi removido!`);
    } catch(e) {
      console.log(`Erro ao remover custom command.\n Comando: command remove.\n Server: ${message.guild.name}\n`, e);
    }
  }
}