const Discord = require("discord.js");

exports.run = (client, message, args) => {
  let embed = new Discord.MessageEmbed()
    .setDescription(`Para aprender como eu funciono, veja meu [guia](https://lucassodrem.gitbook.io/kokiabot/)!`);
    
  return message.channel.send({embed: embed});
}