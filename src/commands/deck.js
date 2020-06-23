const Discord = require("discord.js");
const { DeckEncoder } = require('runeterra')
const { embedLorDeck } = require('../embeds/lor/embedLorDeck');
const { embedLorDecken } = require('../embeds/lor/embedLorDeck_en');

exports.run = (client, message, args) => {
  let lang = args[0];
  let code = args[1];
  let order = args[2] && (args[2] == 'name' || args[2] == 'cost') ? args[2] : 'amount';
  
  if(lang != 'en' && lang != 'pt') return message.channel.send('Escolha uma língua: pt ou en.');
  if(!code) return message.channel.send('Digite o código do deck.');

  try {
    const deck = DeckEncoder.decode(code);
    
    if(lang == 'en') {
      embedLorDecken(Discord, message, deck, order);
      return;
    }

    embedLorDeck(Discord, message, deck, order);
  } catch(e) {
    message.channel.send('Código do deck não existe.');
    console.log(`Erro ao mostrar embed.\n Comando: deck.\n Server: ${message.guild.name}\n`, e);
  }
}