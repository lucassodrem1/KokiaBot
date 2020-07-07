const Discord = require("discord.js");
const { getGifs } = require('../../utils/getGifs');

module.exports = {
  name: 'pat',
  description: 'Gifs acariciando.',
  category: '😝 4fun',
  usage: '[user]',
  run(client, message, args) {
    let text = `${message.author.username} pats!`;
    
    let member = message.guild.member(message.mentions.users.first());
    if(member) {
      text = `${message.author.username} pats <@${member.user.id}>!`;
    }

    getGifs(Discord, message, 'anime pat', text);
  }
}