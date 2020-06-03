const GuildFilterController = require('../controllers/GuildFilter');

module.exports.embedIgnoreChannels = async function(Discord, message) {
  let guildFilterController = new GuildFilterController(message.guild.id);
  
  try {
    let ignoreChannels = await guildFilterController.getIgnoreChannelsByGuildId();

    let embed = new Discord.MessageEmbed()
      .setColor(0xf33434)
      .setThumbnail(message.guild.iconURL)
      .setTitle(`Canais não-filtrados em ${message.guild.name}`);

    ignoreChannels.forEach(ignoreChannel => {
      let channel = message.guild.channels.cache.find(channel => channel.id === ignoreChannel.channel_id);

    embed.addField(`${channel.name}`, '_ _', false)
    });

    message.channel.send({embed: embed});
  } catch(e) {
      console.error(e);
  }
}