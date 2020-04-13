const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  let number = Number(args[0]);

  if(!number || number < 1 || number > 5) {
    return message.channel.send('Você precisa escolher um número entre 1 e 5!');
  }

  try {
    let guildController = new GuildController();
    let guildWelcomeImage = await guildController.getWelcomeImageByNumber(message.guild.id, number);
    if(!guildWelcomeImage) {
      return message.channel.send('Não existe nenhuma imagem com este número na galeria!');
    }

    message.channel.send(`Imagem **${number}**: ${guildWelcomeImage.image}`);
  } catch(e) {
    console.error(e);
  }
}