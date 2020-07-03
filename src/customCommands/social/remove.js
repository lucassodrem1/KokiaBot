const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');
const AdminController = require('../../controllers/Admin');

const availablePlat = [
  'twitch',
  'youtube',
  'twitter'
];

exports.run = async (client, message, args) => {
  // Pegar usuários privilegiados.
  let privilegedUsers = await AdminController.getPrivilegedUsers();
  let isPrivilegedUser = privilegedUsers.find(privilegedUser => privilegedUser.user_id == message.author.id);

  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    // Verificar se é usuário privilegiado.
    if(!isPrivilegedUser) return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }

  let platform = args[0];
  if(!platform) return message.channel.send('Escolha uma plataforma entre: twitch, youtube e twitter.');
 
  if(!availablePlat.find(plat => plat == platform)) return message.channel.send('Escolha uma plataforma entre: twitch, youtube e twitter.');

  let username = args[1];
  if(!username) return message.channel.send('Digite seu usuário.');
  
  
  let guildController = new GuildController();
  try {
    let checkDelete = await guildController.removeGuildSocial(message.guild.id, username, platform);
    // Verificar se conta foi deletada.
    if(!checkDelete) return message.channel.send(`Conta em **${platform}** de **${username}** não existe!`);

    // Registrar log se for ação de um usuário privilegiado.
    if(isPrivilegedUser) AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

    message.channel.send(`Conta em **${platform}** de **${username}** foi removida!`);
  } catch(e) {
    console.log(`Erro ao remover user.\n Comando: social remove.\n Server: ${message.guild.name}\n`, e);
  }
}