const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para alterar o canal da mensagem!');
  }
  
  let role = message.mentions.roles.first();

  if(!role) {
    return message.channel.send('Você precisa escolher uma role válida!');
  }

  try{
    let guildController = new GuildController();
    await guildController.updateInfo(message.guild.id, 'verify_role', role.id); 

    message.channel.send(`Usuários verificados ganharão a role **${role.name}**!`);
  } catch(e) {
    console.error(e);
  }
}