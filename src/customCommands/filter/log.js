const GuildFilterController = require('../../controllers/GuildFilter');
const AdminController = require('../../controllers/Admin');

module.exports = {
  name: 'filter log',
  description: 'Define o canal em que serão exibidas os logs de moderação.',
  category: '👮‍♀️ Moderação',
  usage: '<channel>',
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
    
    try {
      let guildFilterController = new GuildFilterController(message.guild.id);

      if(args[0] === 'off') {
        await guildFilterController.updateInfo('log_channel', 0);

        // Registrar log se for ação de um usuário privilegiado.
        if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
          AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
        
        return message.channel.send('Logs de moderação não serão mostrados!');
      }

      let channel = message.mentions.channels.first();
      
      if(!channel) {
        return message.channel.send('Canal de texto não encontrado!');
      }

      await guildFilterController.updateInfo('log_channel', channel.id);

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
      
      message.channel.send(`Logs de moderação serão mostrados em **${channel.name}**!`);
    } catch(e) {
      console.log(`Erro ao alterar canal log.\n Comando: filter log.\n Server: ${message.guild.name}\n`, e);
    }
  }
}