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

const orderPt = {
  'amount': 'quantidade',
  'name': 'nome',
  'cost': 'custo'
}

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
    .setFooter(`Ordem das cartas: quantidade desc > custo asc > nome asc.`);

  let totalCards = 0;
  let regions = [];
  let champions = [];
  let followers = [];
  let spells = [];

  deck.forEach(card => {
    let cardInfo = cardsData[card.set - 1].find(cardData => {
      return cardData.cardCode == card.code;
    });

    // Adicionando regiões e somando total de cartas.
    regions.push(`${regionEmojis[cardInfo.regionRef].icon} ${cardInfo.regionRef}`);
    totalCards += card.count;

    // Adicionando champions. 
    if(cardInfo.type == 'Unidade' && cardInfo.rarity == 'Campeão') {
      champions.push({count: cardNumberCount[card.count], region: regionEmojis[cardInfo.regionRef].color, name: cardInfo.name, cost: cardInfo.cost});
    }

    // Adicionando unidades.
    if(cardInfo.type == 'Unidade') {
      followers.push({count: cardNumberCount[card.count], region: regionEmojis[cardInfo.regionRef].color, name: cardInfo.name, cost: cardInfo.cost});
    }

    // Adicionando spells.
    if(cardInfo.type == 'Feitiço') {
      spells.push({count: cardNumberCount[card.count], region: regionEmojis[cardInfo.regionRef].color, name: cardInfo.name, cost: cardInfo.cost});
    }
  });
  
  // Removendo elementos duplicados de regions.
  regions = [...new Set(regions)];
  embed.setDescription(`**${regions.join('\n')}**`);

  // Avisar se o deck tiver menos de 40 cartas.
  if(totalCards < 40 ) {
    embed.addField('_ _',`⚠️ Deck inválido: não há cartas suficientes (${totalCards}).`);
  }

  // Ordenar champions.
  // Ordenação: Número de cartas desc -> custo asc -> nome asc.
  champions.sort((a, b) => {
    if((a.count == b.count) && (a.cost == b.cost)) {
      if(a.name < b.name) return -1;
      return 0;
    }

    if(a.count == b.count) return a.cost - b.cost;
  });

  // Ordenarr followers.
  followers.sort((a, b) => {
    if((a.count == b.count) && (a.cost == b.cost)) {
      if(a.name < b.name) return -1;
      return 0;
    }

    if(a.count == b.count) return a.cost - b.cost;
  });

  // Ordenarr spells.
  spells.sort((a, b) => {
    if((a.count == b.count) && (a.cost == b.cost)) {
      if(a.name < b.name) return -1;
      return 0;
    }

    if(a.count == b.count) return a.cost - b.cost;
  });

  // Transformando array de objetos em arrays.
  champions = champions.map(champion => {
    return [`${champion.count} ${champion.region} ${champion.name}`]
  });

  followers = followers.map(follower => {
    return [`${follower.count} ${follower.region} ${follower.name}`]
  });

  spells = spells.map(spell => {
    return [`${spell.count} ${spell.region} ${spell.name}`]
  });

  embed.addField('Campeões', champions.join('\n'), true);
  embed.addField('Unidades', followers.join('\n'), true);
  embed.addField('Feitiços', spells.join('\n'), true);

  message.channel.send({embed: embed, split: true})
  .catch(e => {
    console.log(`Erro ao mostrar embed.\n Comando: deck pt.\n Server: ${message.guild.name}\n`, e);
    message.channel.send('Erro ao mostrar embed!');
  });
}