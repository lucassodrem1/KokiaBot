const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');
const AdminController = require('../../controllers/Admin');

exports.run = async (client, message, args) => {
  // Pegar usuários privilegiados.
  let privilegedUsers = await AdminController.getPrivilegedUsers();
  let isPrivilegedUser = privilegedUsers.find(privilegedUser => privilegedUser.user_id == message.author.id);

  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    // Verificar se é usuário privilegiado.
    if(!isPrivilegedUser) return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }
  
  let champion = args.join(' ');

  if(!champion || champion.length > 15) {
    return message.channel.send('Escolha o nome de um campeão válido!');
  }

  try{
    let guildController = new GuildController();

    await guildController.updateInfo(message.guild.id, 'lol_champion_role', champion); 

    if(champion == 'off') return message.channel.send(`Roles dada por maestrias foram desativadas!`);

    // Registrar log se for ação de um usuário privilegiado.
    if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
      AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

    message.channel.send(`Membros precisarão ter maestria com **${champion}** para ganhar role!`);
  } catch(e) {
    console.log(`Erro ao setar lolrole.\n Comando: lolrole set.\n Server: ${message.guild.name}\n`, e);
  }
}