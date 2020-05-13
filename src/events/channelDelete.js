const Discord = require("discord.js");
const GuildController = require('../controllers/Guild');

// Evento para trocar salas se estiverem setadas no banco de dados para algo.
module.exports = async (client, channel) => {
  let guildController = new GuildController();

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
  } catch(e) {
    console.error(e);
  }
}