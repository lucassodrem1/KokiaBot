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
    if(guildData.join_role === '0') {
        return message.channel.send('Nenhuma auto role foi atribuida ainda!');
    }

    await guildController.updateInfo(message.guild.id, 'join_role', 0);

    // Registrar log se for ação de um usuário privilegiado.
    if(isPrivilegedUser) AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
    
    message.channel.send('Auto role removida!');
  } catch(e) {
    console.log(`Erro ao remover join role.\n Comando: joinrole remove.\n Server: ${message.guild.name}\n`, e);
  }
}