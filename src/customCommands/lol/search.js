const Discord = require("discord.js");
const  GuildLolController = require('../../controllers/GuildLol');
const icons = {
  "top": "<:Top:739723435185537026>",
  "jungle": "<:Jungle:739723423806390294>",
  "mid": "<:Mid:739723410841796700>",
  "adc": "<:Bottom:739723396455071775>",
  "suporte": "<:Support:739723378260312066>"
}

const eloNames = {
  "ferro": "iron",
  "bronze": "bronze",
  "prata": "silver",
  "gold": "gold",
  "platina": "platinium",
  "diamond": "diamond",
  "mestre": "mestre",
  "gm": "grandmaster",
  "challenger": "challenger"
}

module.exports = {
  name: 'lol search',
  description: 'Busca por jogadores de lol que estejam cadastrados na Kokia.',
  category: '🎮 Jogos',
  usage: '<elo> [role] [main]',
  async run (client, message, args) {
    let elo = args[0];
    if(!elo) return message.channel.send(`<@${message.author.id}>, escolha um elo, caso não tenha uma preferência, use **qualquer**.\nSe está precisando de ajuda, use o comando **lol help**!`);
    
    let role = args[1];
    if(!role) role = 'qualquer';

    let main = args.slice(2).join(' ');
    if(!main) main = 'qualquer'; 

    try {
      let data = {userId: message.author.id, elo: elo.toLowerCase(), role: role.toLowerCase(), main: main.toLowerCase()};
      let account = await GuildLolController.searchAccount(data);
      
      if(!account) return message.channel.send(`<@${message.author.id}>, nenhum usuário foi encontrado!`);

      account.eloImage = account.elo !== 'indefinido' ? `https://opgg-static.akamaized.net/images/medals/${eloNames[account.elo]}_1.png?image=q_auto&v=1` : 'https://opgg-static.akamaized.net/images/medals/default.png';

      let embed = new Discord.MessageEmbed()
        .setColor(0xf33434)
        .setAuthor(account.elo.charAt(0).toUpperCase() + account.elo.slice(1), account.eloImage)
        .setDescription(`Usuário: <@${account.user_id}>`);

      // Mostrar nick se tiver definido.
      if(account.nick.length) {
        embed.addField('**Nick**', account.nick, false);
      }

      embed
        .addField('**Main**', account.main.charAt(0).toUpperCase() + account.main.slice(1), true)
        .addField('**Role**', `${icons[account.role]} ${account.role.charAt(0).toUpperCase() + account.role.slice(1)}`, true)
        .addField('**Gosta de jogadores(as) de:**', account.like_main.charAt(0).toUpperCase() + account.like_main.slice(1), true)


      // Mostrar descrição se tiver.
      if(account.description.length)
        embed.addField('Descrição', account.description || '_ _', false);

      // Mostrar imagem do main se tiver definido.
      if(account.main !== 'indefinido') {
        embed.setThumbnail(`https://opgg-static.akamaized.net/images/lol/champion/${account.main}.png?image=q_auto,w_46&v=1595653530`);
        embed.setImage(`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${account.main.charAt(0).toUpperCase() + account.main.slice(1)}_0.jpg`);
      }
    
      message.channel.send(`<@${message.author.id}>, usuário foi encontrado!`, {embed: embed, split: true});
    } catch(e) {
      console.log(`Erro ao pesquisar usuario.\n Comando: lol search.\n Server: ${message.guild.name}\n`, e);
      message.channel.send(`<@${message.author.id}>, pesquisa não pôde ser efetuada, tente novamente.`);
    }
  }
}