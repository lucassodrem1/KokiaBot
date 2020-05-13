const Discord = require("discord.js");
const GuildController = require('../controllers/Guild');

// Evento para trocar salas se estiverem setadas no banco de dados para algo.
module.exports = async (client, role) => {
  let guildController = new GuildController();

  try {
    let guildData = await guildController.getGuild(role.guild.id);

    // Verificar se é join_role.
    if(role.id == guildData.join_role) {
      await guildController.updateInfo(role.guild.id, 'join_role', 0);
    }

    // Verificar se é verify_role.
    if(role.id == guildData.verify_role) {
      await guildController.updateInfo(role.guild.id, 'verify_role', 0);
    }

    // Verificar se é blacklist_role
    if(role.id == guildData.blacklist_role) {
      await guildController.updateInfo(role.guild.id, 'blacklist_role', 0);
    }
  } catch(e) {
    console.error(e);
  }
}