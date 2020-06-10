const Discord = require("discord.js");
const Jikan = require('jikan-node');
const mal = new Jikan();
const { embedSearchAnime } = require('../embeds/embedSearchAnime');
const { formatAnimeGenre } = require('../utils/formatAnimeGenre');

exports.run = async (client, message, args) => {
  let genre = args[0];
  let score = args[1];
  
  if(!genre) return message.channel.send('Você precisa escolher um gênero.');
  if(!score) score = 0;
  if(score < 0 || score > 10) return message.channel.send('Você precisa escolher um nota entre 0 e 10.');

  genreNumber = formatAnimeGenre(genre.toLowerCase());
  if(!genreNumber) {
    let embed = new Discord.MessageEmbed()
      .setDescription(`Esse gênero não existe. Veja os gêneros disponíveis [aqui](https://lucassodrem.gitbook.io/kokiabot/animes)!`);
    return message.channel.send({embed: embed});
  }
  try {
    let searchingMsg = message.channel.send(`Pesquisando animes de **${genre}** com nota mínima à **${score}**...`);
    
    let animesData = await mal.search('anime', '', {genre: genreNumber, score: score});
    if(!animesData.results.length) return message.channel.send('Nenhum anime encontrado!'); 
    
    shuffleArray(animesData.results);
    animesData.results.splice(20);
    embedSearchAnime(Discord, message, animesData);
    
    searchingMsg.then(msg => msg.edit('Pesquisa concluída!'));
  } catch(e) {
    console.log(`Erro ao mostrar embed.\n Comando: sranime.\n Server: ${message.guild.name}\n`, e);
    message.channel.send('Ops, Algo deu errado! Pesquise novamente.');
  }
}

// Embaralhar array.
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}