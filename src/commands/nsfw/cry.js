const Discord = require("discord.js");
const { getGifs } = require('../../utils/getGifs');

module.exports = {
  name: 'cry',
  description: 'Gifs chorando.',
  category: '😝 4fun',
  usage: '[user]',
  run(client, message, args) {
    let text = `${message.author.username} cries!`;
    
    let member = message.guild.member(message.mentions.users.first());
    if(member) {
      text = `${message.author.username} cries <@${member.user.id}>!`;
    }

    getGifs(Discord, message, 'anime cry', text);
  }
}