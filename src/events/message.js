const Discord = require("discord.js");
const UserController = require('../controllers/User');
const { talkedRecently } = require('../main');

module.exports = async (client, message) => {
  if (message.author.bot) return;

  let guildId = message.member.guild.id;
  let userId = message.author.id;

  // Verificar se está em tempo de cooldown.
  if(talkedRecently.has(message.author.id)) return;
  
  // Adicionar user no tempo de cooldown.
  talkedRecently.add(message.author.id);
  setTimeout(() => {
    talkedRecently.delete(message.author.id);
  }, 60000);

  let userController = new UserController();
  
  // Dar xp ao usuário ao mandar mensagem.
  userController.earnXp(guildId, userId, message);
}