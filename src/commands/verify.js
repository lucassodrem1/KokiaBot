const Discord = require("discord.js");
const GuildController = require('../controllers/Guild');

exports.run = async (client, message, args) => {
  try {
    // Verificar se usuário é um administrador.
    if(!message.member.hasPermission('MANAGE_ROLES')) {
      return message.channel.send('Você precisa ter permissão de **gerenciar cargos** para usar este comando!');
    }

    let guildController = new GuildController();
    let guildData = await guildController.getGuild(message.guild.id);

    // Verificar se existe verify role.
    if(guildData.verify_role === '0') {
      return message.channel.send('Ops.. parece que nenhuma role ainda foi definida para atribuir ao usuário!');
    }

    let member = message.guild.member(message.mentions.users.first());
    if(!member) {
      return message.channel.send('Usuário inválido!');
    }
    
    // Dar verify role.
    let addRole = member.guild.roles.cache.find(role => role.id === guildData.verify_role);
    if(!addRole) {
      return message.channel.send('A role definida na verificação não foi encontrada! Defina outra role.');
    }

    // Verificar se usuário já está verificado.
    if(member.roles.cache.has(guildData.verify_role)) {
      return message.channel.send('Este usuário já está verificado!');
    }
    
    // Remover auto role, caso houver.
    if(guildData.join_role !== '0') {
      let removeRole = member.guild.roles.cache.find(role => role.id === guildData.join_role);
      member.roles.remove(removeRole)
      .catch(e => {
        console.log(`Erro: Não tem permissão pra retirar role!\n Comando: verify.\n Server: ${message.guild.name}\n`, e);
        message.channel.send(`Kokia não pôde retirar a role **${removeRole.name}** por falta de permissões!`);
      });
    }

    member.roles.add(addRole)
    .catch(e => {
      console.log(`Erro: Não tem permissão pra dar role!\n Comando: verify.\n Server: ${message.guild.name}\n`, e);
      message.channel.send(`Kokia não pôde dar a role **${addRole.name}** por falta de permissões!`);
    });

    message.channel.send(`Usuário verificado e agora tem a role **${addRole.name}**!`);
  } catch(e) {
    console.log(`Erro ao dar verify.\n Comando: verify.\n Server: ${message.guild.name}\n`, e);
  }
}