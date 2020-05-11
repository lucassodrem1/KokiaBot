const Discord = require("discord.js");
const { getGifs } = require('../../utils/getGifs');

exports.run = (client, message, args) => {
  let text = `${message.author.username} drinks coffee!`;
  
  let member = message.guild.member(message.mentions.users.first());
  if(member) {
    text = `${message.author.username} gives <@${member.user.id}> a coffee!`;
  }

  getGifs(Discord, message, 'anime coffee', text);
}