const GuildFilterController = require('../controllers/GuildFilter');
const AdminController = require('../controllers/Admin');

module.exports = {
  name: 'kick',
  description: 'Expulsa um membro do servidor.',
  category: '👮‍♀️ Moderação',
  usage: '<user> [motivo]',
  permission: 'Expulsar membros',
  async run(client, message, args) {
    try {
      // Pegar usuários privilegiados.
      let privilegedUsers = await AdminController.getPrivilegedUsers();
      let isPrivilegedUser = privilegedUsers.find(privilegedUser => privilegedUser.user_id == message.author.id);

      // Verificar se usuário é um administrador.
      if(!message.member.hasPermission('KICK_MEMBERS')) {
        // Verificar se é usuário privilegiado.
        if(!isPrivilegedUser) return await message.channel.send('Você precisa ter permissão de **expulsar membros** para usar este comando!');
      }

      // Pegar todos os usuários verificados.
      let member = message.mentions.users.first();
      if(!member) {
        return await message.channel.send('Usuário inválido!');
      }
      let guildMember = message.guild.member(member);
      
      // Pegar reason.
      let kickReason = args.slice(1).join(' ').length ? args.slice(1).join(' ') : '_ _';

      // Dar ban no usuário.
      await guildMember.kick({reason: kickReason});

      message.channel.send(`<@${member.id}> foi expulso do servidor!`);

      let guildFilterController = new GuildFilterController(message.guild.id);
      let guildFilter = await guildFilterController.getGuildFilter();
      
      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('KICK_MEMBERS')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

      // Exibir mensagem de log caso o channel estiver ativo.
      if(guildFilter.log_channel != 0) {
        return guildFilterController.sendModPenaltyLog(message, `<@${member.id}>`, guildFilter.log_channel, 'Expulsão', kickReason, '0xf33434');
      }

      message.channel.send(`<@${member.id}> foi kickado.`);
    } catch(e) {
      if(e.message === 'Missing Permissions') 
        return message.channel.send('Não tenho permissão para expulsar este usuário.');

      console.log(`Erro ao dar kick.\n Comando: kick.\n Server: ${message.guild.name}\n`, e);
    }
  }
}