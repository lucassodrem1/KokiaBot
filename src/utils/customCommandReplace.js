const GuildController = require('../controllers/Guild');

module.exports.customCommandReplace = async function(message, command, response) {
  try {
    response = response.replace('{user}', `<@${message.author.id}>`);
    response = response.replace('{percent}', Math.floor(Math.random() * 101)+'%');
    
    if(response.includes('{member}')) {
      let member = message.guild.member(message.mentions.users.first());
      if(member) response = response.replace('{member}', `<@${member.id}>`);
    }

    if(response.includes('{random.member}')) {
      let guildMembers = Array.from(message.guild.members.cache.keys());
      let randomMember = Math.floor(Math.random() * guildMembers.length);
      response = response.replace('{random.member}', `<@${guildMembers[randomMember]}>`);
    }

    if(response.includes('{count}')) {
      let guildController = new GuildController();
      let customCommand = await guildController.increaseCountCustomCommand(message.guild.id, command)
      response = response.replace('{count}', customCommand.count);
    }
    
    return response;
  } catch(e) {
    console.log(`Erro ao substituir variaveis.\n Util: customCommandReplace.\n Server: ${message.guild.name}\n`, e);
  }
}