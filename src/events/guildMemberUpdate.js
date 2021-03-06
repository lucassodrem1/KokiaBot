const GuildFilterController = require('../controllers/GuildFilter');

module.exports = (client, oldMember, newMember) => {
  let hadMutedRole = oldMember.roles.cache.find(role => role.name === "Muted");
  let hasMutedRole = newMember.roles.cache.find(role => role.name === "Muted");

  // Remove usuário do db que já foram desmutados manualmente.
  if(hadMutedRole && hasMutedRole === undefined) {
    GuildFilterController.deleteMutedUser(oldMember.guild.id, oldMember.id);
  }
}