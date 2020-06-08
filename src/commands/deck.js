const Discord = require("discord.js");
const { DeckEncoder } = require('runeterra')
const { embedLorDeck } = require('../embeds/lor/embedLorDeck');
const { embedLorDecken } = require('../embeds/lor/embedLorDeck_en');

exports.run = (client, message, args) => {
  let lang = args.splice(0, 1).join('').toLowerCase();
  let code = args.join('');
  
  if(lang != 'en' && lang != 'pt') return message.channel.send('Escolha uma língua: pt ou en.');
  if(!code) return message.channel.send('Digite o código do deck.');

  try {
    const deck = DeckEncoder.decode(code);
    
    if(lang == 'en') {
      embedLorDecken(Discord, message, deck);
      return;
    }

    embedLorDeck(Discord, message, deck);
  } catch(e) {
    message.channel.send('Código do deck não existe.');
    console.log(e);
  }
}