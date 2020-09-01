const cardsData1 = require("../../../assets/lor/data/en/cardsSet1.json");
const cardsData2 = require("../../../assets/lor/data/en/cardsSet2.json");
const cardsData3 = require("../../../assets/lor/data/en/cardsSet3.json");

const regionIcons = {
  "Bilgewater": "https://cdn.discordapp.com/attachments/712882676880900196/719610077354655804/icon-bilgewater.png",
  "Demacia": "https://cdn.discordapp.com/attachments/712882676880900196/719610082249146418/icon-demacia.png",
  "Freljord": "https://cdn.discordapp.com/attachments/712882676880900196/719610084409475123/icon-freljord.png",
  "Ionia": "https://cdn.discordapp.com/attachments/712882676880900196/719610085604851823/icon-ionia.png",
  "Noxus": "https://cdn.discordapp.com/attachments/712882676880900196/719610087261470780/icon-noxus.png",
  "PiltoverZaun": "https://cdn.discordapp.com/attachments/712882676880900196/719610088960295052/icon-piltover_e_zaun.png",
  "ShadowIsles": "https://cdn.discordapp.com/attachments/712882676880900196/719610090965172224/icon-shadowisles.png",
  "Targon": "https://cdn.discordapp.com/attachments/712882676880900196/750077132004261888/r8.png",
}


module.exports.embedLorCarden = function(Discord, message, card) {
  // Procurar carta no set 1.
  let cardInfo = cardsData1.find(cardData => {
    return cardData.name.toLowerCase() == card.toLowerCase();
  });

  // Caso não encontre no set 1,
  // procurar no set 2.
  if(!cardInfo) {
    cardInfo = cardsData2.find(cardData => {
      return cardData.name.toLowerCase() == card.toLowerCase();
    });
  }

  // Caso não encontre no set 2,
  // procurar no set 3.
  if(!cardInfo) {
    cardInfo = cardsData3.find(cardData => {
      return cardData.name.toLowerCase() == card.toLowerCase();
    });
  }

  // Caso a carta não seja encontrada em nenhum dos set.
  if(!cardInfo) return message.channel.send('Esta carta não existe!');

  let embed = new Discord.MessageEmbed()
    .setColor(0xf33434)
    .setAuthor(cardInfo.name, regionIcons[cardInfo.regionRef])
    .setThumbnail(cardInfo.assets[0].gameAbsolutePath)
    .setDescription(`**Region:** ${cardInfo.regionRef}\n\n${cardInfo.descriptionRaw}`)
    .addField('Cost', cardInfo.cost, true)
    .addField('Attack', cardInfo.attack, true)
    .addField('Health', cardInfo.health, true)

  message.channel.send({embed: embed});
}