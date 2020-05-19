const Discord = require("discord.js");
const UserController = require('../../controllers/User');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('OWNER')) {
    return message.channel.send('Você precisa ser o proprietário do servidor para usar este comando!');
  }

  let userController = new UserController();

  if(args[0] === 'all') {
    try {
      await userController.resetAllUsers(message.guild.id);
      
      return message.channel.send('Level de todos os usuários foram resetados!');
    } catch(e) {
      console.error(e);
      message.channel.send('Algo deu errado! Tente novamente.');
    }
  }

  let member = message.mentions.members.first();

  if(!member) {
    return message.channel.send('Especifique um usuário ou use **all** para resetar de todos.');
  }

  try {
    await userController.resetUserById(message.guild.id, member.id);

    return message.channel.send(`Level de **${member.nickname}** foi resetado!`);
  } catch(e) {
    message.channel.send('Usuário é um bot ou não foi encontrado!');
  }
}