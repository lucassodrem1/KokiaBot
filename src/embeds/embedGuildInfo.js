const { welcomeReplace } = require('../utils/welcomeReplace');
const GuildController = require('../controllers/Guild');

module.exports.embedGuildInfo = async function(Discord, message) {
  let guildController = new GuildController();
  
  try {
    let guildData = await guildController.getGuild(message.guild.id);
    let joinRole = message.guild.roles.cache.find(role => role.id === guildData.join_role);
    let verifyRole = message.guild.roles.cache.find(role => role.id === guildData.verify_role);
    let roleReplace = guildController.custom_role_replace ? 'ON' : 'OFF';

    let guildLevelSystem = await guildController.getGuildLevelSystem(message.guild.id);
    let levelUpChannel = 'default';
    if(guildLevelSystem.level_up_channel !== '0') {
      levelUpChannel = message.guild.channels.cache.find(channel => channel.id === guildLevelSystem.level_up_channel);
      levelUpChannel = levelUpChannel.name;
    }

    let guildWelcomeData = await guildController.getGuildWelcome(message.guild.id);
    let welcomeStatus = guildWelcomeData.status ? 'ON' : 'OFF';    
    let welcomeChannel = 'default';
    if(guildWelcomeData.channel !== '0') {
      welcomeChannel = message.guild.channels.cache.find(channel => channel.id === guildWelcomeData.channel);
      welcomeChannel = welcomeChannel.name;
    }

    let embed = new Discord.MessageEmbed()
      .setTitle('Configurações no servidor.')
      .addField('**Prefixo**', `\`\`\`${guildData.prefix}\`\`\``, true)
      .addField('**Auto Role**', `\`\`\`${joinRole.name}\`\`\``, true)
      .addField('**Verify Role**', `\`\`\`${verifyRole.name}\`\`\``, true)
      .addField('**Role Replace**', `\`\`\`${roleReplace}\`\`\``, true)
      .addField('**Boas-vindas**', `\`\`\`${welcomeStatus}\`\`\``, true)
      .addField('_ _', '_ _', true)
      .addField('**Canal de aviso de level**', `\`\`\`${levelUpChannel}\`\`\``, true)
      .addField('**Canal de boas-vindas**', `\`\`\`${welcomeChannel}\`\`\``, true)
      .addField('_ _', '_ _', true)
      .addField('**Mensagem ao subir de level**', `\`\`\`${guildLevelSystem.level_up_message}\`\`\``, true)
      .addField('**Título da mensagem de boas-vindas**', `\`\`\`${guildWelcomeData.title}\`\`\``, false)
      .addField('**Descrição da mensagem de boas-vindas**', `\`\`\`${guildWelcomeData.description}\`\`\``, false)
      .addField('**Footer da mensagem de boas-vindas**', `\`\`\`${guildWelcomeData.title}\`\`\``, false);

    message.channel.send({embed: embed});
  } catch(e) {
    console.error(e);
  }
}