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
  
  let guildController = new GuildController();

  try {
    //Verificar se existe joinrole.
    let guildData = await guildController.getGuild(message.guild.id);
    if(guildData.verify_role === '0') {
        return message.channel.send('Nenhuma role é atribuida ao verificar um usuário!');
    }

    await guildController.updateInfo(message.guild.id, 'verify_role', 0);

    // Registrar log se for ação de um usuário privilegiado.
    if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
      AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

    message.channel.send('Role atribuida ao verificar usuário removida!');
  } catch(e) {
    console.log(`Erro ao remover verify.\n Comando: verify remove.\n Server: ${message.guild.name}\n`, e);
  }
}