const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }

  let guildController = new GuildController();
  
  if(args[0] === 'all') {
    let checkDelete = await guildController.deleteAllWelcomeImages(message.guild.id);
    if(!checkDelete) return message.channel.send(`Não existe nenhuma imagem na galeria deste servidor!`);

    return message.channel.send('Todas as imagens foram removidas da galeria!');
  }

  let number = Number(args[0]);

  if(!number || number < 1 || number > 5) {
    return message.channel.send('Você precisa escolher um número entre 1 e 5!');
  }

  try {
    let checkDelete = await guildController.deleteWelcomeImage(message.guild.id, number);
    if(!checkDelete) return message.channel.send(`Imagem **${number}** não foi encontrada na galeria!`);

    message.channel.send(`Imagem **${number}** removida da galeria de boas-vindas!`);
  } catch(e) {
    console.error(e);
  }
}