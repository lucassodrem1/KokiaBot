const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
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
    
    message.channel.send(`Imagem **${number}** adicionada à galeria de boas-vindas!`);
  } catch(e) {
    console.error(e);
  }
}