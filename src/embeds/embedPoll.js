module.exports.embedPoll = function(Discord, message, duration, question, options) {
  const numberIcons = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
  
  let embed = new Discord.MessageEmbed()
      .setTitle(question)
      .setDescription(`Duração: ${duration / 1000} segundos`)
      .setAuthor(message.member.displayName, message.author.displayAvatarURL())
      .setColor(0xf33434)
      .setThumbnail(message.author.displayAvatarURL());

  options.forEach((option, index) => {
    embed.addField('_ _', `${numberIcons[index]} ${option}`, false);
  });

  message.channel.send({embed: embed})
  .then(msg => {
    // Criar reações.
    let results = [];
    options.forEach(async (option, index, array) => {
      await msg.react(numberIcons[index]);
      let filter = reaction => reaction.emoji.name === numberIcons[index];
      let reactFilter = await msg.createReactionCollector(filter, {time: duration});

      reactFilter.on('end', collected => {
        // Verificar se houve erro ao pegar collection.
        // if(collected.first(1)[0] === undefined) 
        
        // Guardar resultado.
        results.push(collected.first(1)[0].count - 1);

        /**
         * Verificar se é o último evento de end.
         * Comparar o último emoji que apareceu com o último do array baseado
         * pelo número de opções criadas - 1
         * Ex: 5 opções - emoji5 == numberIcons4
         **/ 
        if(collected.first(1)[0]._emoji.name == numberIcons[options.length - 1]) {
          // Pegar total de votos.
          let totalResult = results.reduce((accumulator, currentValue) => accumulator + currentValue);

          // Criar embed do resultado.
          let embedResult = new Discord.MessageEmbed()
            .setTitle(question)
            .setDescription(`Resultado da votação criada por <@${message.author.id}>`)
            .setAuthor(message.member.displayName, message.author.displayAvatarURL())
            .setColor(0xf33434)
            .setThumbnail(message.author.displayAvatarURL());

          results.forEach((result, index) => {
            let percentResult = totalResult > 0 ? Number((result / totalResult) * 100).toFixed(0) : 0;
            embedResult.addField('_ _', `${numberIcons[index]} Votos: ${result} (${percentResult}%)`, false);
          });

          message.channel.send({embed: embedResult})
          msg.delete();
        }
      });
    });
  });
}