const { welcomeReplace } = require('../utils/welcomeReplace');
const GuildController = require('../controllers/Guild');

module.exports.embedWelcome = async function(Discord, member, channel, welcomeData) {
  var embed = new Discord.MessageEmbed()
      .setTitle(welcomeReplace(member, welcomeData.title))
      .setAuthor(member.displayName, member.user.avatarURL())
      .setDescription(welcomeReplace(member, welcomeData.description))
      .setColor(0xf33434)
  		.setThumbnail(member.user.avatarURL())
		  .setFooter(welcomeReplace(member, welcomeData.footer));

  try {
    let guildController = new GuildController();
    let guildWelcomeImage = await guildController.getWelcomeImages(member.guild.id);

    // Se houver imagens na galeria, escolher uma aleatoria e mostrar.
    if(Object.keys(guildWelcomeImage).length) {
      let randomImage = Math.floor(Math.random() * Object.keys(guildWelcomeImage).length);
      embed.setImage(guildWelcomeImage[randomImage].image);
      return channel.send({embed: embed});
    }

    // Se não houver, mostrar imagem padrão.
    embed.setImage(welcomeData.image);
    return channel.send({embed: embed});
  } catch(e) {
    console.error(e);
  }
}