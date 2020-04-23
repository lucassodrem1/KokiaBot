const Discord = require("discord.js");

exports.run = (client, message, args) => {
  // Mostrar avatar do própria user se não escolher nenhum.
  if(!args[0]) {
    let embed = new Discord.MessageEmbed()
      .setColor(0xf33434)
      .setImage(message.member.user.avatarURL());

    return message.channel.send({embed: embed});
  }

  // Mostrar avatar de outro user.
  let member = message.guild.member(message.mentions.users.first());

  let embed = new Discord.MessageEmbed()
    .setColor(0xf33434)
    .setImage(member.user.avatarURL());

  return message.channel.send({embed: embed});
};