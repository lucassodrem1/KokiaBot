const GuildController = require('../../controllers/Guild');
const AdminController = require('../../controllers/Admin');

module.exports = {
  name: 'welcome title',
  description: 'Altera o título da mensagem de boas-vindas.',
  category: '👋 Boas-vindas',
  usage: '<mensagem>',
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
    
    let title = args.join(' ');
    if(title.length > 200) return message.channel.send('O título só pode conter até 200 caracteres!');

    let guildController = new GuildController();
    try {
      await guildController.updateWelcome(message.guild.id, 'title', title);

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
      
      message.channel.send('Título da mensagem de boas-vindas foi alterado!');
    } catch(e) {
      console.log(`Erro ao alterar título welcome.\n Comando: welcome title.\n Server: ${message.guild.name}\n`, e);
    }
  }
}