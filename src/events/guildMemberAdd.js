const Discord = require("discord.js");
const UserController = require('../controllers/User');

module.exports = (client, member) => {
  // Salvar id do membro que entrar que não seja bot e 
  // já não esteja salvo no db.
  let userController = new UserController();
  
  if (!member.user.bot) {
    userController.checkIfUserExists(member.guild.id, member.id)
    .then(result => {
      if(!result) {
        userController.addUser(member.guild.id, member.id);
      }
    })
    .catch(err => console.error(err));
  }
}