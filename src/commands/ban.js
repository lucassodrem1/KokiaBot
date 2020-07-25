const GuildFilterController = require('../controllers/GuildFilter');
const AdminController = require('../controllers/Admin');

module.exports = {
  name: 'ban',
  description: 'Bane um membro servidor.',
  category: '👮‍♀️ Moderação',
  usage: '<user> [motivo]',
  permission: 'Banir membros',
  async run(client, message, args) {
    try {
      // Pegar usuários privilegiados.
      let privilegedUsers = await AdminController.getPrivilegedUsers();
      let isPrivilegedUser = privilegedUsers.find(privilegedUser => privilegedUser.user_id == message.author.id);

      // Verificar se usuário é um administrador.
      if(!message.member.hasPermission('BAN_MEMBERS')) {
        // Verificar se é usuário privilegiado.
        if(!isPrivilegedUser) return await message.channel.send('Você precisa ter permissão de **banir membros** para usar este comando!');
      }

      // Pegar todos os usuários verificados.
      let member = message.mentions.users.first();
      if(!member) {
        return await message.channel.send('Usuário inválido!');
      }
      let guildMember = message.guild.member(member);
      
      // Pegar reason.
      let banReason = args.slice(1).join(' ').length ? args.slice(1).join(' ') : '_ _';

      // Dar ban no usuário.
      await guildMember.ban({reason: banReason});

      let guildFilterController = new GuildFilterController(message.guild.id);
      let guildFilter = await guildFilterController.getGuildFilter();
      
      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('BAN_MEMBERS')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

      // Exibir mensagem de log caso o channel estiver ativo.
      if(guildFilter.log_channel != 0) {
        return guildFilterController.sendModPenaltyLog(message, `<@${member.id}>`, guildFilter.log_channel, 'Banimento', banReason, '0xf33434');
      }

      message.channel.send(`<@${member.id}> foi banido(a)!`);
    } catch(e) {
      if(e.message === 'Missing Permissions') 
        return message.channel.send('Não tenho permissão para banir este usuário.');

      console.log(`Erro ao dar ban.\n Comando: ban.\n Server: ${message.guild.name}\n`, e);
    }
  }
}