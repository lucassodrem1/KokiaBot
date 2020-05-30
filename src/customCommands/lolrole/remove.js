const Discord = require("discord.js");
const GuildLolController = require('../../controllers/GuildLol');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }

  let points = args[0];
  
  if(!points) {
    return message.channel.send('Você precisa escolher algo para deletar!');
  }

  let guildLolController = new GuildLolController(message.guild.id);
  if(points == 'all') {
    try {
      await guildLolController.deleteMaestryRole(); 
      return message.channel.send(`Todas as roles dadas por maestria foram removidas!`);
    } catch(e) {
      console.log(e);
    }
  }
  
  try{
    let checkDelete = await guildLolController.deleteMaestryRoleByPoints(points); 

    if(!checkDelete) {
      return message.channel.send(`Não existe uma role ganha com essa quantidade de pontos de maestria!`);
    }

    message.channel.send(`Role dada com **${points}** de maestria foi removida!`);
  } catch(e) {
    console.log(e);
  }
}