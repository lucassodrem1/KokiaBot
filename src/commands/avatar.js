const Discord = require("discord.js");

exports.run = (client, message, args) => {
  // Mostrar avatar do própria user se não escolher nenhum.
  if(!args[0]) {
    let embed = new Discord.MessageEmbed()
      .setDescription(`Clique [aqui](${message.member.user.avatarURL()}) para baixar a imagem.`)
      .setImage(message.member.user.avatarURL());

    return message.channel.send({embed: embed});
  }

  let member = message.guild.member(message.mentions.users.first());

  let embed = new Discord.MessageEmbed()
    .setDescription(`Clique [aqui](${member.user.avatarURL()}) para baixar a imagem.`)
    .setImage(member.user.avatarURL());

  return message.channel.send({embed: embed});
};