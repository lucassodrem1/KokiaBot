const cardsData1 = require("../../../assets/lor/data/pt/cardsSet1.json");
const cardsData2 = require("../../../assets/lor/data/pt/cardsSet2.json");

// Array para acessar o json conforme a versão da carta. 
const cardsData = [
  cardsData1,
  cardsData2
];

const cardNumberCount = {
  1: '１ ×',
  2: '２ ×',
  3: '３ ×'
};

const regionEmojis = {
  "Bilgewater": {
    icon: "<:r3:719621850874904667>",
    color: "<:c3:719621850103152772>"
  },
  "Demacia": {
    icon: "<:r1:719621850585366569>",
    color: "<:c1:719621849935511593>"
  },
  "Freljord": {
    icon: "<:r5:719621851118305283>",
    color: "<:c5:719621850770178048>"
  },
  "Ionia": {
    icon: "<:r4:719621850933493780>",
    color: "<:c4:719621850782630018>"
  },
  "Noxus": {
    icon: "<:r6:719621851244134433>",
    color: "<:c6:719621850447216692>"
  },
  "PiltoverZaun": {
    icon: "<:r2:719621850841350214>",
    color: "<:c2:719621849901957243>"
  },
  "ShadowIsles": {
    icon: "<:r7:719621851332214806>",
    color: "<:c7:719621850425983039>"
  }
};

module.exports.embedLorDeck = function(Discord, message, deck) {
  let embed = new Discord.MessageEmbed()
    .setColor(0xf33434)

  let totalCards = 0;
  let regions = [];
  let champions = '';
  let followers = '';
  let spells = '';
  deck.forEach(card => {
    let cardInfo = cardsData[card.set - 1].find(cardData => {
      return cardData.cardCode == card.code;
    });

    // Adicionando regiões e somando total de cartas.
    regions.push(`${regionEmojis[cardInfo.regionRef].icon} ${cardInfo.regionRef}`);
    totalCards += card.count;

    // Adicionando champions. 
    if(cardInfo.type == 'Unidade' && cardInfo.rarity == 'Campeão') {
      champions += `${cardNumberCount[card.count]} ${regionEmojis[cardInfo.regionRef].color} ${cardInfo.name}\n`;
    }

    // Adicionando unidades.
    if(cardInfo.type == 'Unidade') {
      followers += `${cardNumberCount[card.count]} ${regionEmojis[cardInfo.regionRef].color} ${cardInfo.name}\n`;
    }

    // Adicionando spells.
    if(cardInfo.type == 'Feitiço') {
      spells += `${cardNumberCount[card.count]} ${regionEmojis[cardInfo.regionRef].color} ${cardInfo.name}\n`;
    }
  });
  
  // Removendo elementos duplicados de regions.
  regions = [...new Set(regions)];
  embed.setDescription(`**${regions.join('\n')}**`);

  // Avisar se o deck tiver menos de 40 cartas.
  if(totalCards < 40 ) {
    embed.addField('_ _',`⚠️ Deck inválido: não há cartas suficientes (${totalCards}).`);
  }

  embed.addField('Campeões', champions, true);
  embed.addField('Unidades', followers, true);
  embed.addField('Feitiços', spells, true);

  message.channel.send({embed: embed});
}