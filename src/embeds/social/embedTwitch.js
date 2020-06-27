const GuildController = require('../../controllers/Guild');

module.exports.embedTwitch = async function(Discord, channel, streamer, social) {
  // Setando tamanho da thumbnail_url.
  let thumbnail_url = streamer.thumbnail_url.replace('{width}', '340');
  thumbnail_url = thumbnail_url.replace('{height}', '180');

  social.text = social.text.replace('{link}', `https://twitch.tv/${streamer.user_name.toLowerCase()}`);

  try {
    let embed = new Discord.MessageEmbed()
      .setColor(0x9147ff)
      .setAuthor(streamer.user_name, streamer.profile_image_url)
      .setThumbnail(streamer.profile_image_url)
      .setTitle(streamer.title)
      .setURL(`https://twitch.tv/${streamer.user_name.toLowerCase()}`)
      .addField('Jogo', streamer.game_name, false)
      .setImage(thumbnail_url);

    channel.send(social.text, {embed: embed});
  } catch(e) {
    console.log(`Erro ao mostrar embed da twitch.\n Embed: embedTwitch.\n`, e);
  }
}