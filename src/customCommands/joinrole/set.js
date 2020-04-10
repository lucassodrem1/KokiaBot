const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para alterar a mensagem!');
  }
  
  let role = message.mentions.roles.first();

  if(!role) {
    return message.channel.send('Você precisa escolher uma role!');
  }
  
  let guildController = new GuildController();
  await guildController.updateInfo(message.guild.id, 'join_role', role.id);

  message.channel.send('Auto role quando usuário entrar definida!');
}