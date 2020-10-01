const GuildController = require('../../controllers/Guild');
const Discord = require("discord.js");
const fetch = require('node-fetch');
let Parser = require('rss-parser');
let parser = new Parser();

module.exports.checkYoutube = async function(client, guildData, social) {  
  let feed = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${social.username}`)
    .catch(e => {});

  if(!feed || !feed.items[0]) return;

  try {
    
    let newVideo =  new Date(feed.items[0].pubDate).getTime();
    let videonOnDb = new Date(social.date).getTime();
    
    // Verificar se tem video mais novo que o que está no db.
    if(newVideo > videonOnDb) {
      let guildController = new GuildController();
      // Atualizar date do vídeo mais novo no db.
      await guildController.updateGuildSocial(social, 'date', feed.items[0].pubDate);

      // Pegar guilda.
      let guild = client.guilds.cache.find(guild => guild.id == social.guild_id);

      // Pegar canal escolhido.
      let channel = guild.channels.cache.find(channel => channel.id == guildData.youtube_channel);

      // Anunciar video.
      channel.send(`${social.text} ${feed.items[0].link}`);
    }

  } catch(e) {
    console.log(`Erro ao mostrar stream do youtube.\n Util: checkYoutube.\n`, e);
  }
}