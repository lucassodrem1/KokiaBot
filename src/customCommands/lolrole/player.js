const Discord = require("discord.js");
const GuildLolController = require('../../controllers/GuildLol');
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  let guildController = new GuildController();
  // Verificar se lol maestry não está off.
  let guildData = await guildController.getGuild(message.guild.id);
  if(guildData.lol_champion_role == 'off') {
    return message.channel.send('Está função está desabilitada neste servidor!');
  }

  let regionsOptions = ["NA", "EUW", "EUNE", "BR", "OCE", "KR", "TR", "LAS", "LAN", "RU", "JP"];

  let userRegion = args[0];
  let username = args.splice(1).join('');

  let findRegion = regionsOptions.find(region => region == userRegion);

  if(!findRegion) {
    return message.channel.send(`Região inválida! Opções: ${regionsOptions.join(', ')}`);
  }

  if(!username) {
    return message.channel.send('Você precisa pôr seu nick do lol!');
  }

  // Embed para pedir confirmação.
  let embed = new Discord.MessageEmbed()
    .setDescription('1 - Troque o ícone da sua conta para o da imagem abaixo.\n 2 - Clique na reação (☑️) da mensagem para confirmar.\n  **Você tem apenas 3 minutos!**')
    .setColor(0xf33434)
    .setImage('https://cdn.discordapp.com/attachments/712882676880900196/716395386930987038/icon.png');

  message.channel.send({embed: embed})
  .then(msg => {
    msg.react('☑️').then(react => {
      const confirmFilter = (reaction, user) => reaction.emoji.name === '☑️' && user.id === message.author.id;

      const confirm = msg.createReactionCollector(confirmFilter, {time: 180000});

      // Ação quando usuário confirmar.
      confirm.on('collect', async r => {
        let guildLolController = new GuildLolController(message.guild.id);
        await guildLolController.giveRole(userRegion, username, Discord, message, msg);
        r.remove();
        confirm.stop();
      });
    });
  });
}
