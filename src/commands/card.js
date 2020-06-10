const Discord = require("discord.js");
const { DeckEncoder } = require('runeterra')
const { embedLorCard } = require('../embeds/lor/embedLorCard');
const { embedLorCarden } = require('../embeds/lor/embedLorCard_en');

exports.run = (client, message, args) => {
  let lang = args.splice(0, 1).join('').toLowerCase();
  let card = args.join(' ');
  
  if(lang != 'en' && lang != 'pt') return message.channel.send('Escolha uma língua: pt ou en.');
  if(!card) return message.channel.send('Digite o nome da carta.');

  try {
    if(lang == 'en') {
      embedLorCarden(Discord, message, card);
      return;
    }

    embedLorCard(Discord, message, card);
  } catch(e) {
    message.channel.send('Algo de errado aconteceu :( Tente novamente.');
    console.log(`Erro ao mostrar embed.\n Comando: card.\n Server: ${message.guild.name}\n`, e);
  }
}