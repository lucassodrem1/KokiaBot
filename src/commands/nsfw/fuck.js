const Discord = require("discord.js");

module.exports = {
  name: 'fuck',
  description: 'Gifs NSFW.',
  category: '😝 4fun',
  usage: '[user]',
  run(client, message, args) {
    if(!message.channel.nsfw) return message.channel.send('Este canal não permite conteúdo NSFW!');

    let randomImage = Math.floor(Math.random() * client.config.nsfw.fuck.length);
    let text = `${message.author.username} fucks!`;
    
    let member = message.guild.member(message.mentions.users.first());
    if(member) {
      text = `${message.author.username} fucks <@${member.user.id}>!`;
    }

    // Criando embed.
    let embed = new Discord.MessageEmbed()
    .setColor(0xf33434)
    .setDescription(text)
    .setImage(client.config.nsfw.fuck[randomImage]);

    message.channel.send({embed: embed});
  }
}