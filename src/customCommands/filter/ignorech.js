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

  try{
    let guildFilterController = new GuildFilterController(message.guild.id);
    let ignoreChannels = await guildFilterController.getIgnoreChannelsByGuildId();
    if(ignoreChannels.length >= 10) {
      return message.channel.send(`Cada server só pode ter 10 canais na lista de não-filtrados!`);
    }

    await guildFilterController.addIgnoreChannel(channel.id); 

    // Registrar log se for ação de um usuário privilegiado.
    if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
      AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
    
    message.channel.send(`Canal **${channel.name}** irá ignorar todos os filtros!`);
  } catch(e) {
    message.channel.send('Este canal já está na lista!');
    console.log(`Erro ao adicionar canal ignore.\n Comando: filter ignorech.\n Server: ${message.guild.name}\n`, e);
  }
}