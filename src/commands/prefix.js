const Discord = require("discord.js");
const GuildController = require('../controllers/Guild');

exports.run = async (client, message, args) => {
  let guildController = new GuildController();

  // Se o usuário não passar nenhum argumento, irá mostrar o prefixo atual.
  if(!args[0]) {
    try {
      let guildData = await guildController.getGuild(message.member.guild.id);
      
      return message.channel.send(`O meu prefixo é: **${guildData.prefix}**.\n Você pode alterá-lo usando o comando: **${guildData.prefix}prefix <prefixo>**`);
    } catch(err) {
      console.log(`Erro ao mostrar prefixo atual.\n Comando: prefix.\n Server: ${message.guild.name}\n`, err);
    }
  }

  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para alterar o prefixo!');
  }

  if(args[0].length > 3) return message.channel.send(`O prefixo só pode ter no máximo 3 caracteres.`);

  // Alterar prefixo do bot.
  try {
    await guildController.updateInfo(message.member.guild.id, 'prefix', args[0]);
    message.channel.send(`Prefixo alterado com sucesso!`);
  } catch(err) {
    console.log(`Erro ao alterar prefixo.\n Comando: prefix.\n Server: ${message.guild.name}\n`, err);
  }
}