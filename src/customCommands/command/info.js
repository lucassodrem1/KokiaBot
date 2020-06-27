const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  let guildController = new GuildController();
  
  try {
    let guildData = await guildController.getGuild(message.guild.id);
    let guildCustomCommands = await guildController.getCustomCommandsByGuild(message.guild.id);
  
    let allCommands = [];
    guildCustomCommands.forEach(commands => {
      allCommands.push(guildData.prefix+''+commands.command);
    });

    if(allCommands.length == 0) allCommands.push('Nenhum comando customizado no servidor!');

    let embed = new Discord.MessageEmbed()
      .setTitle('Comandos customizados do servidor.')
      .setDescription(`\`\`\`${allCommands.join(', ')}\`\`\``);

    message.channel.send({embed: embed});
  } catch(e) {
    console.log(`Erro ao mostrar embed.\n Comando: command info.\n Server: ${message.guild.name}\n`, e);
  }
}