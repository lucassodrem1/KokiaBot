module.exports.embedSearchAnime = function(Discord, message, animesData) {
  let actualPage = 1;
  let pages = [];

  // Divide 5 animes por página e adiciona em pages.
  while(animesData.anime.length) {
    let page = animesData.anime.splice(0, 5);
    pages.push(page);
  }

  let embed = new Discord.MessageEmbed()
    .setTitle('Animes encontrados:')
    .setColor(0xf33434)
    .setFooter(`Página ${actualPage} de ${pages.length}.`);

  // Adicionando primeira página.
  pages[actualPage - 1].forEach(anime => {
    embed.addField('**Nome**', `[${anime.title}](${anime.url})`, true);
    embed.addField('**Nota**', anime.score, true);
    embed.addField('_ _', '_ _', false);
  });

  message.channel.send({embed: embed})
  .then( msg => {
    msg.react('⬅').then( r => {
      msg.react('➡');

      const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id === message.author.id;
      const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id === message.author.id;
      
      const backwards = msg.createReactionCollector(backwardsFilter, {timer: 6000});
      const forwards = msg.createReactionCollector(forwardsFilter, {timer: 6000});
      
      // Reação ao ir para página anterior.
      backwards.on('collect', r => {
        if (actualPage === 1) return;
        actualPage--;

        // Editando página.
        embed.fields = [];
        pages[actualPage - 1].forEach(anime => {
          embed.addField('**Nome**', `[${anime.title}](${anime.url})`, true);
          embed.addField('**Nota**', anime.score, true);
          embed.addField('_ _', '_ _', false);
        });
        embed.setFooter(`Página ${actualPage} de ${pages.length}.`);
        msg.edit(embed);

        // Removendo reação.
        msg.reactions.removeAll().then(() => {
          msg.react('⬅').then(() => msg.react('➡'));
        });
      });

      // Reação ao ir para a próxima página. 
      forwards.on('collect', r => {
        if (actualPage === pages.length) return;
        actualPage++;
        
        // Editando página.
        embed.fields = [];
        pages[actualPage - 1].forEach(anime => {
          embed.addField('**Nome**', `[${anime.title}](${anime.url})`, true);
          embed.addField('**Nota**', anime.score, true);
          embed.addField('_ _', '_ _', false);
        });
        embed.setFooter(`Página ${actualPage} de ${pages.length}.`);
        msg.edit(embed);

        // Removendo reação.
        msg.reactions.removeAll().then(() => {
          msg.react('⬅').then(() => msg.react('➡'));
        });
      });
    });
  });   
}