const GuildController = require('../controllers/Guild');
const { checkStream } = require('../utils/social/checkStream');
const { checkYoutube } = require('../utils/social/checkYoutube');

module.exports = async (client) => {
  console.log(`Ready to serve in ${client.channels.cache.size} channels on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users.`);

  // Alter status do bot.
  client.user.setActivity('Kokia: https://bit.ly/kokiabot', {type: 'Watching'})
  
  // Verificar social a cada 3 segundos.
  setInterval(async () => {    
    let guildController = new GuildController();
    let guildSocials = await guildController.getAllGuildSocial();
    
    guildSocials.forEach(async social => {
      let guildData = await guildController.getGuild(social.guild_id);

      // Verificar se twitch está habilitado no servidor.
      if(guildData.twitch_channel != 0 && social.platform == 'twitch') {
        // Checar streams da Twitch.
        checkStream(client, guildData, social);
      }
      // Verificar video novo no canal do youtube.
      if(guildData.youtube_channel != 0 && social.platform == 'youtube') {
        // Checar novo video do Youtube.
        checkYoutube(client, guildData, social);
      }
    });
  }, 5000);
}