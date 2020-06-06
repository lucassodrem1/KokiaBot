const Discord = require("discord.js");
const { embedPoll } = require('../embeds/embedPoll');

exports.run = (client, message, args) => {
  // Transformando segundo para milisegundo.
  let duration = args.splice(0, 1) * 1000;
  let options = args.join(' ').split('"');

  // Rovendo index vazios.
  options = options.filter(option => {
    return option != '' && option != ' ';
  });

  let question = options.splice(0, 1);

  if(duration < 60000) return message.channel.send('Tempo mínimo da votação é de 60 segundos.');

  if(options.length < 2) return message.channel.send('Coloque pelo menos 2 opções.');

  if(options.length > 5) return message.channel.send('Você só pode colocar até 5 opções.');

  embedPoll(Discord, message, duration, question, options);
}