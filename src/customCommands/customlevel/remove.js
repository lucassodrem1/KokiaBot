const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');
const AdminController = require('../../controllers/Admin');

module.exports = {
  name: 'customlevel remove',
  description: 'Remove um ou todos os levels customizados.',
  category: '🧙 XP & Leveling',
  usage: '<level/all>',
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
    
    let guildController = new GuildController();
    if(args[0] === 'all') {
      try{
        await guildController.deleteCustomLevels(message.guild.id); 

        // Registrar log se for ação de um usuário privilegiado.
        if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
          AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

        return message.channel.send(`Todos os levels customizados foram removidos!`);
      } catch(e) {
        console.error(e);
      }
    }
    
    let level = args[0];

    if(!level) {
      return message.channel.send('Você precisa definir um level!');
    }

    try{
      let checkDelete = await guildController.deleteCustomLevelsByLevel(message.guild.id, level); 

      if(!checkDelete) {
        return message.channel.send(`Não existe um level customizado com este level!`);
      }

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

      message.channel.send(`Level customizado removido!`);
    } catch(e) {
      console.log(`Erro ao remover custom level.\n Comando: customlevel remove.\n Server: ${message.guild.name}\n`, e);
    }
  }
}