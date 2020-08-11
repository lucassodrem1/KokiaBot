const Discord = require("discord.js");

module.exports = {
  name: 'site',
  description: 'Exibe o site da documentação da Kokia.',
  category: '📜 Informações',
  async run(client, message, args) {
    try {
      let embed = new Discord.MessageEmbed()
      .setColor(0xf33434)
      .setAuthor(client.user.username, client.user.displayAvatarURL())
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(`[Site da Kokia!](https://lucassodrem.gitbook.io/kokiabot/)`);

      await message.channel.send({embed: embed});
    } catch(e) {
      console.log(`Erro ao mostrar invite.\n Comando: invite.\n Server: ${message.guild.name}\n`, e);
    }
  }
}