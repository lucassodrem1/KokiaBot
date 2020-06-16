const Discord = require("discord.js");
const UserController = require('../controllers/User');
const GuildController = require('../controllers/Guild');
const { embedWelcome } = require('../embeds/embedWelcome');

module.exports = async (client, member) => {
  let userController = new UserController();
  let guildController = new GuildController();
  
  // Pegar primeiro canal de texto que encontrar
  // para mandar mensagem de boas-vindas.
  let channel = member.guild.channels.cache.find(channel => channel.type === 'text');

  try {
    let guildWelcomeData = await guildController.getGuildWelcome(member.guild.id);
    // Mostrar mensagem de boas-vindas caso estiver ativada no servidor.
    if(guildWelcomeData.status) {
      // Alterar canal de texto para o que o usuário escolheu.
      if(guildWelcomeData.channel !== '0') {
        let customChannel = member.guild.channels.cache.find(channel => channel.id == guildWelcomeData.channel);
        if(customChannel) {
          channel = customChannel;
        }
      }
      
      // Enviar mensagem de boas-vindas.
      // embedWelcome(Discord, member, channel, guildWelcomeData);
    }
  } catch(e) {
    console.log(`Erro ao mostrar embed.\n Evento: guildMemberAdd.\n Server: ${member.guild.name}\n`, e);
  }

  try {
    let result = await userController.checkIfUserExists(member.guild.id, member.id)
    
    if(result) {
      userController.deleteUser(member.guild.id, member.id);
    }

    // Dar join role, caso houver.
    let guildData = await guildController.getGuild(member.guild.id);
    if(guildData.join_role !== '0') {
      let role = member.guild.roles.cache.find(role => role.id === guildData.join_role);
      member.roles.add(role).catch(e => {
        console.log(`Erro: Não tem permissão pra dar role!\n Evento: guildMemberAdd.\n Server: ${member.guild.name}\n`, e);
        channel.send(`Kokia não pôde dar a autorole **${role.name}** por falta de permissões!`);
      });
    }
  } catch(e) {
    console.log(`Erro ao dar autorole.\n Evento: guildMemberAdd.\n Server: ${member.guild.name}\n`, e);
  }
}