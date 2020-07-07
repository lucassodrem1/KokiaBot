const GuildLolController = require('../../controllers/GuildLol');
const AdminController = require('../../controllers/Admin');

module.exports = {
  name: 'lolrole add',
  description: 'Adicione roles dadas por maestria.',
  category: '🎮 Jogos',
  usage: '<maestria> <role>',
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

    let guildLolController = new GuildLolController(message.guild.id);
    // Verificar se server já possui 10 maestry roles.
    let roles = await guildLolController.getRoles();
    if(roles.length >= 10) {
      return message.channel.send('Cada servidor só pode ter até 10 roles dadas por maestria!');
    }

    let points = args[0];
    let role = message.mentions.roles.first();

    if(!points) {
      return message.channel.send('Você precisa definir o mínimo de maestria necessário!');
    }

    if(!role) {
      return message.channel.send('Você precisa escolher uma role válida!');
    }

    try{
      await guildLolController.addMaestryRole(points, role.id); 

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

      message.channel.send(`Role **${role.name}** será pega com no mínimo **${points}** de maestria!`);
    } catch(e) {
      console.log(`Erro ao adicionar lolrole.\n Comando: lolrole add.\n Server: ${message.guild.name}\n`, e);
    }
  }
}