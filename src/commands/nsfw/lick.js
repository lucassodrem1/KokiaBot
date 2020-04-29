const Discord = require("discord.js");
const { getGifs } = require('../../utils/getGifs');

exports.run = (client, message, args) => {
  let text = `${message.author.username} licks!`;
  
  let member = message.guild.member(message.mentions.users.first());
  if(member) {
    text = `${message.author.username} licks <@${member.user.id}>!`;
  }

  getGifs(Discord, message, 'anime lick', text);
}