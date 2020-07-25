const Discord = require("discord.js");

module.exports = {
  name: 'invite',
  description: 'Exibe link de invite da Kokia.',
  category: '📜 Informações',
  async run(client, message, args) {
    try {
      let embed = new Discord.MessageEmbed()
      .setColor(0xf33434)
      .setAuthor(client.user.username, client.user.displayAvatarURL())
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(`Chame a Kokia para o seu servidor!\n\n[Convite](https://discord.com/oauth2/authorize?client_id=695267877892259890&scope=bot&permissions=1544027254)`);

      await message.channel.send({embed: embed});
    } catch(e) {
      console.log(`Erro ao mostrar invite.\n Comando: invite.\n Server: ${message.guild.name}\n`, e);
    }
  }
}