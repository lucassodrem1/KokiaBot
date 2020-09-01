const GuildController = require('../../controllers/Guild');
const SystemController = require('../../controllers/System');
const { embedTwitch } = require('../../embeds/social/embedTwitch');
const fetch = require('node-fetch');
const Discord = require("discord.js");

module.exports.checkStream = async function(client, guildData, social) {
  let guildController = new GuildController();
  try {
    let requestStreamer = await fetch(`https://api.twitch.tv/helix/streams?user_login=${social.username}`, { 
      headers: { 'Authorization': process.env.TWITCH_TOKEN, 'Client-ID': process.env.TWITCH_CLIENT_ID } 
    });
    let response = await requestStreamer.json();

    if(!response || !response.data) return;
    
    // Verificar se stream está online.
    if(!response.data.length) {
      // Setar online para 0 se já não estiver.
      if(social.online == 0) return;

      await guildController.updateGuildSocial(social, 'online', 0);
      return;
    }

    // Verificar se stream já foi anunciada.
    if(social.online == 1) return;

    // Setar online para 1.
    await guildController.updateGuildSocial(social, 'online', 1);

    // Somar em vezes aparecidas e pegar esse valor.
    let timesAppeared = await SystemController.updateSystemAdsShown();
    social.appeared = timesAppeared;

    // Pegar guilda.
    let guild = client.guilds.cache.find(guild => guild.id == social.guild_id);

    // Pegar canal escolhido.
    let channel = guild.channels.cache.find(channel => channel.id == guildData.twitch_channel);

    // Pegar imagem do usuário.
    let requestUser = await fetch(`https://api.twitch.tv/helix/users?login=${social.username}`, { 
      headers: { 'Authorization': process.env.TWITCH_TOKEN, 'Client-ID': process.env.TWITCH_CLIENT_ID } 
    });
    let responseUser = await requestUser.json();
    response.data[0].profile_image_url = responseUser.data[0].profile_image_url;

    // Pegar jogo, se houver.
    // Nome padrão para caso não houver jogo escolhido.
    response.data[0].game_name = 'Nenhum';
    if(response.data[0].game_id.length) {
      let requestGame = await fetch(`https://api.twitch.tv/helix/games?id=${response.data[0].game_id}`, { 
        headers: { 'Authorization': process.env.TWITCH_TOKEN, 'Client-ID': process.env.TWITCH_CLIENT_ID } 
      });
      let responseGame = await requestGame.json();
      response.data[0].game_name = responseGame.data[0].name;
    }

    // Anunciar stream.
    embedTwitch(Discord, channel, response.data[0], social);
  } catch(e) {
    console.log(`Erro ao mostrar stream da twitch.\n Util: checkStream.\n`, e);
  }
}