const Discord = require("discord.js");
const { getGifs } = require('../../utils/getGifs');

module.exports = {
  name: 'smile',
  description: 'Gifs sorrindo.',
  category: '😝 4fun',
  usage: '[user]',
  run(client, message, args) {
    let text = `${message.author.username} smiles!`;
    
    let member = message.guild.member(message.mentions.users.first());
    if(member) {
      text = `${message.author.username} smiles <@${member.user.id}>!`;
    }

    getGifs(Discord, message, 'anime smile', text);
  }
}