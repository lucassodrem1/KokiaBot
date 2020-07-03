const Discord = require("discord.js");
const AdminController = require('../controllers/Admin');

exports.run = async (client, message, args) => {
  // Pegar usuários privilegiados.
  let privilegedUsers = await AdminController.getPrivilegedUsers();
  let isPrivilegedUser = privilegedUsers.find(privilegedUser => privilegedUser.user_id == message.author.id);
  
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    // Verificar se é usuário privilegiado.
    if(!isPrivilegedUser) return message.channel.send('Você precisa ser um administrador para usar slowmode!');
  }
  
  let time = args[0];

  if(!time) return message.channel.send('Especifique um tempo de slowmode.');
  if(isNaN(time)) return message.channel.send('Digite um tempo válido.');

  message.channel.setRateLimitPerUser(time).then(newChannel => {
    // Registrar log se for ação de um usuário privilegiado.
    if(isPrivilegedUser) AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
    
    if(time == 0) {
      return message.channel.send(`**${message.channel.name}** não está em slow mode.`);
    }

    return message.channel.send(`${message.channel.name} está em slow mode (${newChannel.rateLimitPerUser} segundos).`);
  }).catch(e => console.log(`Erro ao por slowmode.\n Comando: slowmode.\n Server: ${message.guild.name}\n`, e));
}