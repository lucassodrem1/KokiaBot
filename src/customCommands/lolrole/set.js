const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }
  
  let champion = args.join(' ');

  if(!champion || champion.length > 15) {
    return message.channel.send('Escolha o nome de um campeão válido!');
  }

  try{
    let guildController = new GuildController();

    await guildController.updateInfo(message.guild.id, 'lol_champion_role', champion); 

    if(champion == 'off') return message.channel.send(`Roles dada por maestrias foram desativadas!`);

    message.channel.send(`Membros precisarão ter maestria com **${champion}** para ganhar role!`);
  } catch(e) {
    console.log(`Erro ao setar lolrole.\n Comando: lolrole set.\n Server: ${message.guild.name}\n`, e);
  }
}