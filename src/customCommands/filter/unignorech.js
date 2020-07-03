const Discord = require("discord.js");
const GuildFilterController = require('../../controllers/GuildFilter');
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

  let channel = message.mentions.channels.first();
    
  if(!channel) {
    return message.channel.send('Canal de texto não encontrado!');
  }

  let guildFilterController = new GuildFilterController(message.guild.id);
  
  try{
    let checkDelete = await guildFilterController.deleteIgnoreChannel(channel.id); 

    if(!checkDelete) {
      return message.channel.send(`Este canal não está na lista dos canais ignorados pelos filtros!`);
    }

    // Registrar log se for ação de um usuário privilegiado.
    if(isPrivilegedUser) AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

    message.channel.send(`Canal **${channel.name}** foi retirado da lista!`);
  } catch(e) {
    console.log(`Erro ao remover canal da lista ignorados.\n Comando: filter unignorech.\n Server: ${message.guild.name}\n`, e);
  }
}