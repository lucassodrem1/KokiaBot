const Discord = require("discord.js");
const UserController = require('../controllers/User');
const { embedCanvasRank } = require('../embeds/canvas/embedRank');

exports.run = async (client, message, args) => {
  guildId = message.member.guild.id;
  userId = message.author.id;

  let userController = new UserController();
  
  let member = message.guild.member(message.mentions.users.first());

  if(!member) {
    try {
      const userInfoPromise = userController.getUserInfo(userId, message).catch(err => console.error(err));
      const usersRankPromise = userController.getUsersRank(guildId).catch(err => console.error(err));
      const [userData, rankData] = await Promise.all([userInfoPromise, usersRankPromise]);
      
      userData.avatar = message.author.displayAvatarUR();
      userData.displayName = message.member.displayName;
      userData.ranking = rankData.findIndex(b => b.user_id == message.author.id) + 1;
      embedCanvasRank(Discord, message, userData);
    } catch(err) {
      console.log(`Erro ao mostrar embed.\n Comando: rank.\n Server: ${message.guild.name}\n`, e);
    }
  } else {
    try {
      const userInfoPromise = userController.getUserInfo(member.user.id, message).catch(err => console.error(err));
      const usersRankPromise = userController.getUsersRank(guildId).catch(err => console.error(err));
      const [userData, rankData] = await Promise.all([userInfoPromise, usersRankPromise]);

      userData.avatar = member.user.displayAvatarURL();
      userData.displayName = member.displayName;
      userData.ranking = rankData.findIndex(b => b.user_id == member.user.id) + 1;
      embedCanvasRank(Discord, message, userData);
    } catch(err) {
      console.log(`Erro ao mostrar embed.\n Comando: rank.\n Server: ${message.guild.name}\n`, err);
    }
  }
}