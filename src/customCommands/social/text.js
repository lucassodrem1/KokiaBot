const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');
let Parser = require('rss-parser');
let parser = new Parser();

const availablePlat = [
  'twitch',
  'youtube'
];

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }

  let platform = args[0];
  if(!platform) return message.channel.send('Escolha uma plataforma entre: twitch, youtube.');

  if(!availablePlat.find(plat => plat == platform)) return message.channel.send('Escolha uma plataforma entre: twitch, youtube.');

  let text = args.splice(1).join(' ');
  if(!text) return message.channel.send('Digite o texto que irá aparecer.');
  
  let guildController = new GuildController();
  try {
    let updated = await guildController.updateGuildSocialText(message.guild.id, platform, text);
    if(!updated) return message.channel.send(`Ainda não tem anúncios criados de **${platform}** neste servidor.`);

    return message.channel.send(`Texto de anúncios de **${platform}** foi atualizado!`);
  } catch(e) {
    console.log(`Erro ao editar texto.\n Comando: social text.\n Server: ${message.guild.name}\n`, e);
  }
}