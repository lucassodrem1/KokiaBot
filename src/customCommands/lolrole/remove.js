const Discord = require("discord.js");
const GuildLolController = require('../../controllers/GuildLol');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }

  let points = args[0];
  
  if(!points) {
    return message.channel.send('Você precisa definir o mínimo de maestria necessário!');
  }
  
  try{
    let guildLolController = new GuildLolController(message.guild.id);
    await guildLolController.removeMaestryRole(points); 

    message.channel.send(`Role dada com **${points}** de maestria foi removida!`);
  } catch(e) {
    console.error(e);
  }
}