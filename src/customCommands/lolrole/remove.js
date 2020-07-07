const GuildLolController = require('../../controllers/GuildLol');
const AdminController = require('../../controllers/Admin');

module.exports = {
  name: 'lolrole remove',
  description: 'Remove uma ou todas as roles dadas por maestria.',
  category: '🎮 Jogos',
  usage: '<maestria/all>',
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

    let points = args[0];
    
    if(!points) {
      return message.channel.send('Você precisa escolher algo para deletar!');
    }

    let guildLolController = new GuildLolController(message.guild.id);
    if(points == 'all') {
      try {
        await guildLolController.deleteMaestryRole(); 

        // Registrar log se for ação de um usuário privilegiado.
        if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
          AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

        return message.channel.send(`Todas as roles dadas por maestria foram removidas!`);
      } catch(e) {
        console.log(`Erro ao remover lolrole.\n Comando: lolrole remove.\n Server: ${message.guild.name}\n`, e);
      }
    }
    
    try{
      let checkDelete = await guildLolController.deleteMaestryRoleByPoints(points); 

      if(!checkDelete) {
        return message.channel.send(`Não existe uma role ganha com essa quantidade de pontos de maestria!`);
      }

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

      message.channel.send(`Role dada com **${points}** de maestria foi removida!`);
    } catch(e) {
      console.log(`Erro ao remover lolrole.\n Comando: lolrole remove.\n Server: ${message.guild.name}\n`, e);
    }
  }
}