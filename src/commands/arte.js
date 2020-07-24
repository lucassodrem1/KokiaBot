const Discord = require("discord.js");

module.exports = {
  name: 'arte',
  description: 'Exibe informação do artista da Kokia.',
  category: '📜 Informações',
  async run(client, message, args) {
    try {
      let embed = new Discord.MessageEmbed()
      .setColor(0xf33434)
      .setAuthor(client.user.username, client.user.displayAvatarURL())
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(`Siga o artista da Kokia no [twitter!](https://twitter.com/edsanthiago)`);

      await message.channel.send({embed: embed});
    } catch(e) {
      console.log(`Erro ao mostrar arte.\n Comando: arte.\n Server: ${message.guild.name}\n`, e);
    }
  }
}