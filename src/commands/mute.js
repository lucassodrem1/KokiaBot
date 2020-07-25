const GuildFilterController = require('../controllers/GuildFilter');
const AdminController = require('../controllers/Admin');

module.exports = {
  name: 'mute',
  description: 'Mute um membro do servidor.',
  category: '👮‍♀️ Moderação',
  usage: '<user> [duração] [m/h/d] [motivo]',
  permission: 'Gerenciar cargos',
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

      // Pegar usuário.
      let member = message.mentions.users.first();
      if(!member) {
        return await message.channel.send('Escolha um usuário!');
      }
      let guildMember = message.guild.member(member);

      // Definir tempo mutado e motivo.
      let defaultMutedTime = Date.now() + 60 * 60 * 1000;
      let mutedTime = defaultMutedTime;
      let mutedTimeText = '1h';
      let reason = args.slice(3).join(' ').length ? args.slice(3).join(' ') : '_ _';

      // Verificar se o número foi escolhido.
      if(args[1]) {
        // Se é um número.
        // se o número digitado for entre 1 e 60.
        if(isNaN(args[1]) || args[1] < 1 || args[1] > 60) {
          return message.channel.send('Escolha um tempo entre 1 e 60. **O m/h/d deve ficar separado do número.**\nExemplo: mute <usuario> 2 m <motivo>'); 
        }

        if(!args[2])
          return message.channel.send('Escolha a duração entre m/h/d. Exemplo: mute <usuario> 2 m <motivo>');

        if(args[2].substr(0, 1) === 'm') {
          mutedTime = Date.now() + args[1] * 60 * 1000;
          mutedTimeText = `${args[1]}m`;
        }
        
        if(args[2].substr(0, 1) === 'h') {
          mutedTime = Date.now() + args[1] * 60 * 60 * 1000;
          mutedTimeText = `${args[1]}h`;
        }  

        if(args[2].substr(0, 1) === 'd') {
          mutedTime = Date.now() + args[1] * 24 * 60 * 60 * 1000;
          mutedTimeText = `${args[1]}d`;
        }
      }

      // Verificar se já existe a role.
      let muteRole = message.guild.roles.cache.find(role => role.name == 'Muted');
      if(!muteRole) {
        // Criar role.
        muteRole = await message.guild.roles.create({
          data: {
            name: 'Muted',
            permissions: []
          }
        });
      }

      // Setar permissões de role.
      message.guild.channels.cache.forEach(async channel => {
        await channel.createOverwrite(muteRole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
      
      // Dar role ao usuário.
      await guildMember.roles.add(muteRole);
      
      let guildFilterController = new GuildFilterController(message.guild.id);
      let guildFilter = await guildFilterController.getGuildFilter();
      guildFilterController.addMutedUser(member.id, mutedTime);

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('MANAGE_ROLES')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
      
      // Exibir mensagem de log caso o channel estiver ativo.
      if(guildFilter.log_channel != 0) {
        return guildFilterController.sendModPenaltyLog(message, `<@${member.id}>`, guildFilter.log_channel, `Mutado | ${mutedTimeText}`, reason, '0xfac10c');
      }

      message.channel.send(`<@${member.id}> foi mutado por ${mutedTimeText}.`);
    } catch(e) {
      if(e.message === 'Missing Permissions') 
        return message.channel.send('Não tenho permissão para mutar este usuário.');

      console.log(`Erro ao dar mute.\n Comando: mute.\n Server: ${message.guild.name}\n`, e);
    }
  }
}