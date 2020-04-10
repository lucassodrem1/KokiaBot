const Discord = require("discord.js");
const UserController = require('../controllers/User');
const GuildController = require('../controllers/Guild');

module.exports = async (client, member) => {
  let userController = new UserController();
  
  if (!member.user.bot) {
    try {
      let result = await userController.checkIfUserExists(member.guild.id, member.id)
      
      if(result) {
        userController.deleteUser(member.guild.id, member.id);
      }

      // Dar join role, caso houver.
      let guildController = new GuildController();
      let guildData = await guildController.getGuild(member.guild.id);
      if(guildData.join_role !== '0') {
        let role = member.guild.roles.cache.find(role => role.id === guildData.join_role);
        member.roles.add(role);
      }
    } catch(e) {
      console.error(e);
    }
  }
}