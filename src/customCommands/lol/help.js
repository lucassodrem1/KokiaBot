const Discord = require("discord.js");

module.exports = {
  name: 'lol help',
  description: 'Exibe link do guia do sistema do lol.',
  category: '🎮 Jogos',
  async run(client, message, args) {
    try {
      let embed = new Discord.MessageEmbed()
      .setColor(0xf33434)
      .setAuthor(client.user.username, client.user.displayAvatarURL())
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(`Parece que você está um pouco perdido, leia o [guia](https://app.gitbook.com/@lucassodrem/s/kokiabot/encontre-seu-duo) para saber mais sobre o sistema de duo!`);

      await message.channel.send({embed: embed});
    } catch(e) {
      console.log(`Erro ao mostrar invite.\n Comando: invite.\n Server: ${message.guild.name}\n`, e);
    }
  }
}