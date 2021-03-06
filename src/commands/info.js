const Discord = require("discord.js");
const GuildController = require('../controllers/Guild');

module.exports = {
  name: 'info',
  description: 'Exibe informações gerais do servidor.',
  category: '📜 Informações',
  async run(client, message, args) {
    let guildController = new GuildController();
    
    try {
      let guildData = await guildController.getGuild(message.guild.id);
      let joinRole = guildData.join_role != 0 ? message.guild.roles.cache.find(role => role.id === guildData.join_role).name : 'OFF';
      let verifyRole = guildData.verify_role != 0 ? message.guild.roles.cache.find(role => role.id === guildData.verify_role).name : 'OFF';
      let muteRole = guildData.blacklist_role != 0 ? message.guild.roles.cache.find(role => role.id == guildData.blacklist_role).name : 'OFF';
      let roleReplace = guildController.custom_role_replace != 0 ? 'ON' : 'OFF';

      let guildLevelSystem = await guildController.getGuildLevelSystem(message.guild.id);
      let levelUpChannel = 'default';
      if(guildLevelSystem.level_up_channel !== '0') {
        levelUpChannel = message.guild.channels.cache.find(channel => channel.id === guildLevelSystem.level_up_channel).name;
      }
      let rankStatus = guildLevelSystem.status != 0 ? 'ON' : 'OFF';

      let guildWelcomeData = await guildController.getGuildWelcome(message.guild.id);
      let welcomeStatus = guildWelcomeData.status ? 'ON' : 'OFF';    
      let welcomeChannel = 'default';
      if(guildWelcomeData.channel !== '0') {
        welcomeChannel = message.guild.channels.cache.find(channel => channel.id === guildWelcomeData.channel).name;
      }

      let elegantMail = 'OFF';
      if(guildData.elegant_mail_channel != 0) {
        elegantMail = message.guild.channels.cache.find(channel => channel.id === guildData.elegant_mail_channel).name;
      }

      let welcomeFooter = guildWelcomeData.footer ? guildWelcomeData.footer : ' ';

      let embed = new Discord.MessageEmbed()
        .setTitle('Configurações do servidor.')
        .addField('**Prefixo**', `\`\`\`${guildData.prefix}\`\`\``, true)
        .addField('**Sistema de level**', `\`\`\`${rankStatus}\`\`\``, true)
        .addField('**Role Replace**', `\`\`\`${roleReplace}\`\`\``, true)
        .addField('**Canal de aviso de level**', `\`\`\`${levelUpChannel}\`\`\``, true)
        .addField('**Auto Role**', `\`\`\`${joinRole}\`\`\``, true)
        .addField('**Verify Role**', `\`\`\`${verifyRole}\`\`\``, true)
        .addField('**Non-XP Role**', `\`\`\`${muteRole}\`\`\``, true)
        .addField('**Canal correio elegante**', `\`\`\`${elegantMail}\`\`\``, true)      
        .addField('**Boas-vindas**', `\`\`\`${welcomeStatus}\`\`\``, true)
        .addField('**Canal de boas-vindas**', `\`\`\`${welcomeChannel}\`\`\``, true)
        .addField('**Mensagem ao subir de level**', `\`\`\`${guildLevelSystem.level_up_message}\`\`\``, true)
        .addField('**Título da mensagem de boas-vindas**', `\`\`\`${guildWelcomeData.title}\`\`\``, false)
        .addField('**Descrição da mensagem de boas-vindas**', `\`\`\`${guildWelcomeData.description}\`\`\``, false)
        .addField('**Footer da mensagem de boas-vindas**', `\`\`\`${welcomeFooter}\`\`\``, false);

      message.channel.send({embed: embed});
    } catch(e) {
      console.log(`Erro ao mostrar embed.\n Comando: info.\n Server: ${message.guild.name}\n`, e);
    }
  }
}