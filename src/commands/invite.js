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
      .setDescription(`Chame a Kokia para o seu servidor!\n\n[Convite](https://discordapp.com/oauth2/authorize?client_id=695267877892259890&scope=bot&permissions=1544027248)`);

      await message.channel.send({embed: embed});
    } catch(e) {
      message.channel.send('Código do deck não existe.');
      console.log(`Erro ao mostrar vote.\n Comando: vote.\n Server: ${message.guild.name}\n`, e);
    }
  }
}