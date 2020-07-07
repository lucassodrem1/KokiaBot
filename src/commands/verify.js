const GuildController = require('../controllers/Guild');
const AdminController = require('../controllers/Admin');

module.exports = {
  name: 'verify',
  description: 'Verifica um membro do servidor.',
  category: '👮‍♀️ Moderação',
  usage: '<user>',
  permission: 'Gerenciar roles',
  async run(client, message, args) {
    try {
      // Pegar usuários privilegiados.
      let privilegedUsers = await AdminController.getPrivilegedUsers();
      let isPrivilegedUser = privilegedUsers.find(privilegedUser => privilegedUser.user_id == message.author.id);

      // Verificar se usuário é um administrador.
      if(!message.member.hasPermission('MANAGE_ROLES')) {
        // Verificar se é usuário privilegiado.
        if(!isPrivilegedUser) return await message.channel.send('Você precisa ter permissão de **gerenciar cargos** para usar este comando!');
      }

      let guildController = new GuildController();
      let guildData = await guildController.getGuild(message.guild.id);

      // Verificar se existe verify role.
      if(guildData.verify_role === '0') {
        return await message.channel.send('Ops.. parece que nenhuma role ainda foi definida para atribuir ao usuário!');
      }

      let member = message.guild.member(message.mentions.users.first());
      if(!member) {
        return await message.channel.send('Usuário inválido!');
      }
      
      // Dar verify role.
      let addRole = member.guild.roles.cache.find(role => role.id === guildData.verify_role);
      if(!addRole) {
        return await message.channel.send('A role definida na verificação não foi encontrada! Defina outra role.');
      }

      // Verificar se usuário já está verificado.
      if(member.roles.cache.has(guildData.verify_role)) {
        return await message.channel.send('Este usuário já está verificado!');
      }
      
      // Remover auto role, caso houver.
      if(guildData.join_role !== '0') {
        let removeRole = member.guild.roles.cache.find(role => role.id === guildData.join_role);
        member.roles.remove(removeRole)
        .catch(async e => {
          await message.channel.send(`Kokia não pôde retirar a role **${removeRole.name}** por falta de permissões!`);
        });
      }

      member.roles.add(addRole)
      .catch(async e => {
        await message.channel.send(`Kokia não pôde dar a role **${addRole.name}** por falta de permissões!`);
      });

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('MANAGE_ROLES')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

      await message.channel.send(`Usuário verificado e agora tem a role **${addRole.name}**!`);
    } catch(e) {
      if(e.message !== 'Missing Permissions') 
        console.log(`Erro ao dar verify.\n Comando: verify.\n Server: ${message.guild.name}\n`, e);
    }
  }
}