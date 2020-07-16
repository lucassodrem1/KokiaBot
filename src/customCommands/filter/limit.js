const GuildFilterController = require('../../controllers/GuildFilter');
const AdminController = require('../../controllers/Admin');

module.exports = {
  name: 'filter limit',
  description: 'Altere o limite de pontos para o usuário ser mutado.',
  category: '👮‍♀️ Moderação',
  usage: '<número>',
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

    if(!args[0] || args[0] < 9 || args[0] > 30) return message.channel.send("Defina um limite entre 9 e 30.");
    let limit = args[0];
    
    try {
      let guildFilterController = new GuildFilterController(message.guild.id);

      await guildFilterController.updateInfo('points_to_mute', limit);

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
        
      return message.channel.send(`Limite de pontos alterado para **${limit}**.`);
    } catch(e) {
      console.log(`Erro ao alterar limite de pontos.\n Comando: filter limit.\n Server: ${message.guild.name}\n`, e);
    }
  }
}