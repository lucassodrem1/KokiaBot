const Discord = require("discord.js");
const GuildController = require('../controllers/Guild');

exports.run = async (client, message, args) => {
  try {
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
    
    // Remover auto role, caso houver.
    if(guildData.join_role !== '0') {
      let removeRole = member.guild.roles.cache.find(role => role.id === guildData.join_role);
      member.roles.remove(removeRole);
    }

    member.roles.add(addRole);
    message.channel.send(`Usuário verificado e agora tem a role **${addRole.name}**!`);
  } catch(e) {
    console.error(e);
  }
  
}