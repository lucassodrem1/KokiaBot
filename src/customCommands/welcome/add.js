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

  let number = Number(args[0]);
  let image = args[1];

  if(!number || number < 1 || number > 5) {
    return message.channel.send('Você precisa escolher um número entre 1 e 5!');
  }

  if(!image) return message.channel.send('Por favor, escolha uma imagem!');

  let guildController = new GuildController();
  try {
    await guildController.addWelcomeImage(message.guild.id, number, image);

    // Registrar log se for ação de um usuário privilegiado.
    if(isPrivilegedUser) AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
    
    message.channel.send(`Imagem **${number}** adicionada à galeria de boas-vindas!`);
  } catch(e) {
    console.log(`Erro ao adicionar imagem welcome.\n Comando: welcome add.\n Server: ${message.guild.name}\n`, e);
  }
}