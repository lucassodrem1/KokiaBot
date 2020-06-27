const Discord = require("discord.js");
const GuildController = require('../controllers/Guild');
const GuildFilterController = require('../controllers/GuildFilter');

// Evento para trocar salas se estiverem setadas no banco de dados para algo.
module.exports = async (client, channel) => {
  let guildController = new GuildController();
  let guildFilterController = new GuildFilterController(channel.guild.id);

  try {
    let guildData = await guildController.getGuild(channel.guild.id);
    let guildLevelSystem = await guildController.getGuildLevelSystem(channel.guild.id);
    let guildWelcome = await guildController.getGuildWelcome(channel.guild.id);

    // Verificar se é canal de correio elegante.
    if(channel.id == guildData.elegant_mail_channel) {
      await guildController.updateInfo(channel.guild.id, 'elegant_mail_channel', 0);
    }

    // Verificar se é canal de level up.
    if(channel.id == guildLevelSystem.level_up_channel) {
      await guildController.updateSystemLevel(channel.guild.id, 'level_up_channel', 0);
    }

    // Verificar se é canal de level up.
    if(channel.id == guildWelcome.channel) {
      await guildController.updateWelcome(channel.guild.id, 'channel', 0);
    }

    // Verificar se é canal de publicação da twitch.
    if(channel.id == guildData.twitch_channel) {
      await guildController.updateInfo(channel.guild.id, 'twitch_channel', 0);
    }

    // Verificar se é canal de publicação do youtube.
    if(channel.id == guildData.youtube_channel) {
      await guildController.updateInfo(channel.guild.id, 'youtube_channel', 0);
    }

    // Verificar se é canal que está na lista de ignorar filtros.
    let ignoreChannels = await guildFilterController.getIgnoreChannelsByGuildId();
    let isIgnoreChannel = ignoreChannels.find(ignoreChannel => {
      return ignoreChannel.channel_id == channel.id;
    });

    if(isIgnoreChannel) await guildFilterController.deleteIgnoreChannel(isIgnoreChannel.channel_id);
  } catch(e) {
    console.log(`Erro ao deletar canal.\n Evento: channelDelete.\n Server: ${channel.guild.name}\n`, e);
  }
}