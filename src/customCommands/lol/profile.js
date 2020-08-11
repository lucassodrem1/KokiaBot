const Discord = require("discord.js");
const  GuildLolController = require('../../controllers/GuildLol');
const icons = {
  "top": "<:Top:739723435185537026>",
  "jungle": "<:Jungle:739723423806390294>",
  "mid": "<:Mid:739723410841796700>",
  "adc": "<:Bottom:739723396455071775>",
  "suporte": "<:Support:739723378260312066>",
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
  name: 'lol profile',
  description: 'Mostra suas informações de lol na Kokia.',
  category: '🎮 Jogos',
  async run (client, message, args) {
    try {
      let guildLolController = new GuildLolController(message.author.id);
      let account = await guildLolController.getAccountByUserId();
      
      if(!account) return message.channel.send(`<@${message.author.id}>, você não tem um perfil cadastrado!`);

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
    
      message.channel.send({embed: embed, split: true});
    } catch(e) {
      console.log(`Erro ao mostrar perfil.\n Comando: lol perfil.\n Server: ${message.guild.name}\n`, e);
      message.channel.send(`<@${message.author.id}>, seu perfil não pôde ser mostrado, tente novamente.`);
    }
  }
}
  