const GuildController = require('../../controllers/Guild');
const AdminController = require('../../controllers/Admin');

module.exports = {
  name: 'welcome add',
  description: 'Adiciona imagem na galeria de boas-vindas.',
  category: '👋 Boas-vindas',
  usage: '<numero> <link>',
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

    let number = Number(args[0]);
    let image = args[1];

    if(!number || number < 1 || number > 5) {
      return message.channel.send('Você precisa escolher um número entre 1 e 5!');
    }

    if(!image) return message.channel.send('Por favor, escolha uma imagem!');

    let guildController = new GuildController();
    try {
      await guildController.addWelcomeImage(message.guild.id, number, image);

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
      
      message.channel.send(`Imagem **${number}** adicionada à galeria de boas-vindas!`);
    } catch(e) {
      message.channel.send('Não foi possível adicionar o level customizado.\nEntre em contato com a gente para reportar um possível bug!');
      console.log(`Erro ao adicionar imagem welcome.\n Comando: welcome add.\n Server: ${message.guild.name}\n`, e);
    }
  }
}