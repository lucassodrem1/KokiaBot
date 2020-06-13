const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }
  
  let guildController = new GuildController();
  if(args[0] === 'all') {
    try{
      await guildController.deleteCustomLevels(message.guild.id); 
      return message.channel.send(`Todos os levels customizados foram removidos!`);
    } catch(e) {
      console.error(e);
    }
  }
  
  let level = args[0];

  if(!level) {
    return message.channel.send('Você precisa definir um level!');
  }

  try{
    let checkDelete = await guildController.deleteCustomLevelsByLevel(message.guild.id, level); 

    if(!checkDelete) {
      return message.channel.send(`Não existe um level customizado com este level!`);
    }

    message.channel.send(`Level customizado removido!`);
  } catch(e) {
    console.log(`Erro ao remover custom level.\n Comando: customlevel remove.\n Server: ${message.guild.name}\n`, e);
  }
}