const moment = require('moment');
moment.locale('pt-br')

module.exports = {
  name: 'memberage',
  description: 'Exibe o tempo em que o membro está no servidor.',
  category: '💬 Outros Comandos',
  usage: '[user]',
  run(client, message, args) {
    let member = message.guild.member(message.mentions.users.first());

    if(!member){
      let joinedAt = message.member.joinedAt;
      let time = moment(joinedAt).fromNow();

      return message.channel.send(`${message.member.displayName} está no servidor ${time}.`);
    }

    let joinedAt = member.joinedAt;
    let time = moment(joinedAt).fromNow();

    return message.channel.send(`${member.displayName} está no servidor ${time}.`);
  }
}