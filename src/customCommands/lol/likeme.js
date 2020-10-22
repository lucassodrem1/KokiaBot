const Discord = require("discord.js");
const  GuildLolController = require('../../controllers/GuildLol');
const icons = {
  "top": "<:Top:739723435185537026>",
  "jungle": "<:Jungle:739723423806390294>",
  "mid": "<:Mid:739723410841796700>",
  "adc": "<:Bottom:739723396455071775>",
  "sup": "<:Support:739723378260312066>",
  "indefinida": "<:Role:741081599009095791>"
}

const eloNames = {
  "ferro": "iron",
  "bronze": "bronze",
  "prata": "silver",
  "gold": "gold",
  "platina": "platinum",
  "diamond": "diamond",
  "mestre": "mestre",
  "gm": "grandmaster",
  "challenger": "challenger"
}

module.exports = {
  name: 'lol likeme',
  description: 'Busca por jogadores de lol que possam gostar de você.',
  category: '🎮 Jogos',
  async run (client, message, args) {
    try {
      let guildLolController = new GuildLolController(message.author.id);
      let account = await guildLolController.getAccountByUserId();
      if(!account) return message.channel.send(`<@${message.author.id}>, você não tem um perfil cadastrado!`);

      let data = {userId: message.author.id, main: account.main};
      let accountThatLikeMe = await GuildLolController.searchAccountByLikeMain(data);
      if(!accountThatLikeMe) return message.channel.send(`<@${message.author.id}>, parece que nenhum usuário gosta de você :(`);

      accountThatLikeMe.eloImage = accountThatLikeMe.elo !== 'indefinido' ? `https://opgg-static.akamaized.net/images/medals/${eloNames[accountThatLikeMe.elo]}_1.png?image=q_auto&v=1` : 'https://opgg-static.akamaized.net/images/medals/default.png';

      let embed = new Discord.MessageEmbed()
        .setColor(0xf33434)
        .setAuthor(accountThatLikeMe.elo.charAt(0).toUpperCase() + accountThatLikeMe.elo.slice(1), accountThatLikeMe.eloImage)
        .setDescription(`Usuário: <@${accountThatLikeMe.user_id}>`);

      // Mostrar nick se tiver definido.
      if(accountThatLikeMe.nick.length) {
        embed.addField('**Nick**', accountThatLikeMe.nick, false);
      }

      embed
        .addField('**Main**', accountThatLikeMe.main.charAt(0).toUpperCase() + accountThatLikeMe.main.slice(1), true)
        .addField('**Role**', `${icons[accountThatLikeMe.role]} ${accountThatLikeMe.role.charAt(0).toUpperCase() + accountThatLikeMe.role.slice(1)}`, true)
        .addField('**Gosta de jogadores(as) de:**', accountThatLikeMe.like_main.charAt(0).toUpperCase() + accountThatLikeMe.like_main.slice(1), true)


      // Mostrar descrição se tiver.
      if(accountThatLikeMe.description.length)
        embed.addField('Descrição', accountThatLikeMe.description || '_ _', false);

      // Mostrar imagem do main se tiver definido.
      if(accountThatLikeMe.main !== 'indefinido') {
        let championsFormatName = {
          'bardo': 'bard',
          'mundo': 'dr mundo',
          'reksai': 'rek sai',
          'kogmaw': 'kog maw',
          'jarvan': 'jarvan IV',
          'wukong': 'monkey king'
        };

        if(championsFormatName[account.main]) 
          account.main = championsFormatName[account.main];

        // Formatar nome de personagem para splash art.
        let mainArray = account.main.split(" ");
        let mainWords = [];
        mainArray.forEach(words => {
          mainWords.push(words.charAt(0).toUpperCase() + words.slice(1));
        });

        embed.setThumbnail(`https://opgg-static.akamaized.net/images/lol/champion/${mainWords.join('')}.png?image=q_auto,w_46&v=1595653530`);
        embed.setImage(`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${mainWords.join('')}_0.jpg`);
      }

      message.channel.send(`<@${message.author.id}>, usuário foi encontrado!`, {embed: embed, split: true});
    } catch(e) {
      console.log(`Erro ao pesquisar usuario.\n Comando: lol likeme.\n Server: ${message.guild.name}\n`, e);
      message.channel.send(`<@${message.author.id}>, pesquisa não pôde ser efetuada, tente novamente.`);
    }
  }
}