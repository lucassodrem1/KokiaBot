const Discord = require("discord.js");

module.exports = {
  name: 'vote',
  description: 'Vote na Kokia!.',
  category: '📜 Informações',
  async run(client, message, args) {
    try {
      let embed = new Discord.MessageEmbed()
      .setColor(0xf33434)
      .setAuthor(client.user.username, client.user.displayAvatarURL())
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(`Nos ajude [votando na Kokia!](https://top.gg/bot/695267877892259890/vote)`);

      await message.channel.send({embed: embed});
    } catch(e) {
      console.log(`Erro ao mostrar vote.\n Comando: vote.\n Server: ${message.guild.name}\n`, e);
    }
  }
}