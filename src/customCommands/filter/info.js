const Discord = require("discord.js");
const GuildFilterController = require('../../controllers/GuildFilter');

module.exports = {
  name: 'filter info',
  description: 'Exibe informações dos comandos de filtro.',
  category: '👮‍♀️ Moderação',
  async run(client, message, args) {
    let guildFilterController = new GuildFilterController(message.guild.id);
    
    try {
      let guildFilter = await guildFilterController.getGuildFilter();
      let linkFilter = guildFilter.filter_link ? 'ON' : 'OFF';
      let attachFilter = guildFilter.filter_attach ? 'ON' : 'OFF';
      let termFilter = guildFilter.filter_term ? 'ON' : 'OFF';
      let logChannel = 'OFF';
      if(guildFilter.log_channel !== '0') {
        logChannel = message.guild.channels.cache.find(channel => channel.id === guildFilter.log_channel).name;
      }

      let ignoreChannels = await guildFilterController.getIgnoreChannelsByGuildId();
      let allChannels = [];
      ignoreChannels.forEach(ignoreChannel => {
        let channel = message.guild.channels.cache.find(channel => channel.id === ignoreChannel.channel_id);

        allChannels.push(channel.name);
      });

      if(allChannels.length == 0) allChannels.push('Nenhum');

      let embed = new Discord.MessageEmbed()
        .setTitle('Configurações de filtros do servidor.')
        .addField('**Canal de logs**', `\`\`\`${logChannel}\`\`\``, true)
        .addField('**Pontos para ser mutado**', `\`\`\`${guildFilter.points_to_mute}\`\`\``, true)
        .addField('_ _', '_ _', true)
        .addField('**Filtro de termos**', `\`\`\`${termFilter}\`\`\``, true)
        .addField('**Filtro de link**', `\`\`\`${linkFilter}\`\`\``, true)
        .addField('**Filtro de arquivo**', `\`\`\`${attachFilter}\`\`\``, true)
        .addField('**Canais ignorados pelos filtros**', `\`\`\`${allChannels.join('\n')}\`\`\``, false);

      message.channel.send({embed: embed, split: true});
    } catch(e) {
      console.log(`Erro ao mostrar embed.\n Comando: filter info.\n Server: ${message.guild.name}\n`, e);
    }
  }
}