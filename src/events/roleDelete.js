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

    // Verificar se role está no custom levels.
    let guildCustomLevels = await guildController.getCustomLevels(role.guild.id);
    let isCustomLevel = guildCustomLevels.find(customLevel => {
      return customLevel.role == role.id;
    });

    if(isCustomLevel) await guildController.deleteCustomLevelsByLevel(role.guild.id, isCustomLevel.level);
  } catch(e) {
    console.log(`Erro ao deletar role.\n Evento: roleDelete.\n Server: ${role.guild.name}\n`, e);
  }
}