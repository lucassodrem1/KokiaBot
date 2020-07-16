const GuildFilterController = require('../../controllers/GuildFilter');
const AdminController = require('../../controllers/Admin');

module.exports = {
  name: 'filter reset',
  description: 'Resete os pontos de penalidade de um ou de todos os membros.',
  category: '👮‍♀️ Moderação',
  usage: '<member/all> <motivo>',
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

    let reason = args.splice(1).join(' ');
    reason = reason ? reason : '_ _';

    let guildFilterController = new GuildFilterController(message.guild.id);
    let guildFilter = await guildFilterController.getGuildFilter();

    if(args[0] === 'all') {
      try {
        await guildFilterController.deleteAllUsers();

        // Registrar log se for ação de um usuário privilegiado.
        if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

        return guildFilterController.sendModPenaltyLog(message, '@everyone', guildFilter.log_channel, 'Pontos zerados', reason);
      } catch(e) {
        console.log(`Erro ao resetar penalidade do usuario.\n Comando: filter reset.\n Server: ${message.guild.name}\n`, e);
      }
    }
    
    let member = message.guild.member(message.mentions.users.first());
    if(!member) return  message.channel.send('Escolha um membro ou use **all** para resetar todos.');
    try {
      await guildFilterController.deleteUserPenaltyPoints(member.id);

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
        
        return guildFilterController.sendModPenaltyLog(message, `<@${member.id}>`, guildFilter.log_channel, `Pontos zerados`, reason);
    } catch(e) {
      console.log(`Erro ao resetar penalidade do usuario.\n Comando: filter reset.\n Server: ${message.guild.name}\n`, e);
    }
  }
}