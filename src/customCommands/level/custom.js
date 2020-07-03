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
  
  if(!args[0]) {
    return message.channel.send('Escolha uma mensagem!');
  }
  
  let guildController = new GuildController();
  let guildId = message.member.guild.id;
  
  if(args[0] === 'default') {
    let text = client.config.system_level.level_up_message;
    await guildController.updateSystemLevel(guildId, 'level_up_message', text);

    // Registrar log se for ação de um usuário privilegiado.
    if(isPrivilegedUser) AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

    return message.channel.send('Mensagem ao subir de level foi alterada com sucesso!');
  }

  text = args.join(' ');
  await guildController.updateSystemLevel(guildId, 'level_up_message', text);

  // Registrar log se for ação de um usuário privilegiado.
  if(isPrivilegedUser) AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
  
  message.channel.send('Mensagem ao subir de level foi alterada com sucesso!');
}