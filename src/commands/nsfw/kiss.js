const Discord = require("discord.js");
const { getGifs } = require('../../utils/getGifs');

module.exports = {
  name: 'kiss',
  description: 'Gifs beijando.',
  category: '😝 4fun',
  usage: '[user]',
  run(client, message, args) {
    let text = `${message.author.username} kisses!`;
    
    let member = message.guild.member(message.mentions.users.first());
    if(member) {
      text = `${message.author.username} kisses <@${member.user.id}>!`;
    }

    getGifs(Discord, message, 'kiss anime', text);
  }
}