const GuildController = require('../../controllers/Guild');
const AdminController = require('../../controllers/Admin');

module.exports = {
  name: 'welcome remove',
  description: 'Remove imagem da galeria de boas-vindas.',
  category: '👋 Boas-vindas',
  usage: '<numero>',
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
      let checkDelete = await guildController.deleteAllWelcomeImages(message.guild.id);
      if(!checkDelete) return message.channel.send(`Não existe nenhuma imagem na galeria deste servidor!`);

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

      return message.channel.send('Todas as imagens foram removidas da galeria!');
    }

    let number = Number(args[0]);

    if(!number || number < 1 || number > 5) {
      return message.channel.send('Você precisa escolher um número entre 1 e 5!');
    }

    try {
      let checkDelete = await guildController.deleteWelcomeImage(message.guild.id, number);
      if(!checkDelete) return message.channel.send(`Imagem **${number}** não foi encontrada na galeria!`);

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

      message.channel.send(`Imagem **${number}** removida da galeria de boas-vindas!`);
    } catch(e) {
      console.log(`Erro ao remover imagem welcome.\n Comando: welcome remove.\n Server: ${message.guild.name}\n`, e);
    }
  }
}