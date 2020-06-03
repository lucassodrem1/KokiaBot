const Discord = require("discord.js");

exports.run = (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar slowmode!');
  }
  
  let time = args[0];

  if(!time) return message.channel.send('Especifique um tempo de slowmode.');
  if(isNaN(time)) return message.channel.send('Digite um tempo válido.');

  message.channel.setRateLimitPerUser(time).then(newChannel => {
    if(time == 0) {
      return message.channel.send(`**${message.channel.name}** não está em slow mode.`);
    }

    return message.channel.send(`${message.channel.name} está em slow mode (${newChannel.rateLimitPerUser} segundos).`);
  });


}