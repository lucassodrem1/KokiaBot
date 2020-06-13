const Discord = require("discord.js");
const UserController = require('../../controllers/User');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('OWNER')) {
    return message.channel.send('Você precisa ser o proprietário do servidor para usar este comando!');
  }

  let userController = new UserController();

  let member = message.mentions.members.first();

  if(member.user.bot) return message.channel.send('Usuário não pode ser um bot!');

  if(!member) return message.channel.send('Especifique um usuário!');

  let newLevel = args[1];
  if(!newLevel) return message.channel.send('Especifique um level!');

  try {
    userController.setUserLevelById(message.guild.id, member.id, args[1]);
    
    return message.channel.send(`Level de **${member.displayName}** foi setado para **${args[1]}**!`);
  } catch(e) {
    message.channel.send('Usuário é um bot ou não foi encontrado!');
    console.log(`Erro ao setar level de um usuário.\n Comando: level set.\n Server: ${message.guild.name}\n`, e);
  }
}