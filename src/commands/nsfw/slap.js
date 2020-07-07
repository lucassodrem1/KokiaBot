const Discord = require("discord.js");
const { getGifs } = require('../../utils/getGifs');

module.exports = {
  name: 'slap',
  description: 'Gifs dando tapa.',
  category: '😝 4fun',
  usage: '[user]',
  run(client, message, args) {
    let text = `${message.author.username} slaps!`;
    
    let member = message.guild.member(message.mentions.users.first());
    if(member) {
      text = `${message.author.username} slaps <@${member.user.id}>!`;
    }

    getGifs(Discord, message, 'anime slap', text);
  }
}