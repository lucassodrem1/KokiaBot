const Discord = require("discord.js");
const moment = require('moment');
moment.locale('pt-br')

exports.run = (client, message, args) => {
  let member = message.guild.member(message.mentions.users.first());

  if(!member){
    let joinedAt = message.member.joinedAt;
    let time = moment(joinedAt).fromNow();

    return message.channel.send(`${message.member.displayName} está no servidor ${time}.`);
  }

  let joinedAt = member.joinedAt;
  let time = moment(joinedAt).fromNow();

  return message.channel.send(`${member.displayName} está no servidor ${time}.`);
};