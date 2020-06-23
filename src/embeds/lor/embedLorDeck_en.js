const cardsData1 = require("../../../assets/lor/data/en/cardsSet1.json");
const cardsData2 = require("../../../assets/lor/data/en/cardsSet2.json");

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

module.exports.embedLorDecken = function(Discord, message, deck, order = 'amount') {
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
    if(cardInfo.type == 'Unit' && cardInfo.rarity == 'Champion') {
      champions.push({count: cardNumberCount[card.count], region: regionEmojis[cardInfo.regionRef].color, name: cardInfo.name, cost: cardInfo.cost});
    }

    // Adicionando unidades.
    if(cardInfo.type == 'Unit') {
      followers.push({count: cardNumberCount[card.count], region: regionEmojis[cardInfo.regionRef].color, name: cardInfo.name, cost: cardInfo.cost});
    }

    // Adicionando spells.
    if(cardInfo.type == 'Spell') {
      spells.push({count: cardNumberCount[card.count], region: regionEmojis[cardInfo.regionRef].color, name: cardInfo.name, cost: cardInfo.cost});
    }
  });

  let embed = new Discord.MessageEmbed()
    .setColor(0xf33434)
    .setFooter(`Order by: ${order}.`);
  
  // Removendo elementos duplicados de regions.
  regions = [...new Set(regions)];
  embed.setDescription(`**${regions.join('\n')}**`);
  
  // Avisar se o deck tiver menos de 40 cartas.
  if(totalCards < 40 ) {
    embed.addField('_ _', `⚠️ Invalid deck: too few cards (${totalCards}).`, false);
  }

  // Ordenar em ordem alfabetica, caso o usuário queira.
  if(order == 'name') {
    champions.sort((a, b) => {
      if(a.name < b.name) return -1;
    });
  
    followers.sort((a, b) => {
      if(a.name < b.name) return -1;
    });
  
    spells.sort((a, b) => {
      if(a.name < b.name) return -1;
    });
  }

  // Ordenar em ordem crescente de custo de mana, caso o usuário queira.
  if(order == 'cost') {
    champions.sort((a, b) => {
      if(a.cost < b.cost) return -1;
    });
  
    followers.sort((a, b) => {
      if(a.cost < b.cost) return -1;
    });
  
    spells.sort((a, b) => {
      if(a.cost < b.cost) return -1;
    });
  }

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

  embed.addField('Champions', champions.join('\n'), true);
  embed.addField('Units', followers.join('\n'), true);
  embed.addField('Spells', spells.join('\n'), true);

  message.channel.send({embed: embed})
  .catch(e => {
    console.log(`Erro ao mostrar embed.\n Comando: deck en.\n Server: ${message.guild.name}\n`, e);
    message.channel.send('Erro ao mostrar embed!');
  });
}