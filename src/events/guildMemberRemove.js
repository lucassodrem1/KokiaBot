const Discord = require("discord.js");
const UserController = require('../controllers/User');

module.exports = (client, member) => {
  let userController = new UserController();
  
  // Deletar membro que sair do servidor.
  userController.deleteUser(member.guild.id, member.id);
}