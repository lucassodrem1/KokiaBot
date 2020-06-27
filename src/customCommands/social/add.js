const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');
let Parser = require('rss-parser');
let parser = new Parser();

const availablePlat = {
  'twitch': '@everyone Live on! {link}',
  'youtube': '@everyone Vídeo novo no canal!'
};

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }

  let platform = args[0];
  if(!platform) return message.channel.send('Escolha uma plataforma entre: twitch, youtube.');

  if(!Object.keys(availablePlat).find(plat => plat == platform)) return message.channel.send('Escolha uma plataforma entre: twitch, youtube.');

  let username = args[1];
  if(!username) return message.channel.send('Digite seu usuário.');
  
  let guildController = new GuildController();
  try {
    // Verificar se já tem uma conta nessa plataforma nesse servidor.
    let checkAmount = await guildController.getGuildSocialByGuild(message.guild.id, platform);
    if(checkAmount.length) return message.channel.send(`Já existe uma conta em **${platform}** adicionada nesse servidor!`);

    // Se for youtube, pegar data do ultimo video e gravar no db.
    if(platform == 'youtube') {
      let feed = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${username}`)
        .catch(e => {
          message.channel.send('ID do canal não foi encontrado.');
          throw new Error('feed 404');
        });
        
      await guildController.addGuildSocial(message, username, platform, availablePlat[platform]);
      let data = {guild_id: message.guild.id, username: username, platform: platform};
      await guildController.updateGuildSocial(data, 'date', feed.items[0].pubDate);
      
      return message.channel.send(`Conta em **${platform}** de **${username}** foi adicionada!`);
    }

    await guildController.addGuildSocial(message, username, platform, availablePlat[platform]);
    message.channel.send(`Conta em **${platform}** de **${username}** foi adicionada!`);
  } catch(e) {
    if(e.message == 'feed 404') return;
    
    console.log(`Erro ao adicionar social.\n Comando: social add.\n Server: ${message.guild.name}\n`, e);
  }
}