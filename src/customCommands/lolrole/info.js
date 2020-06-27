const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');
const GuildLolController = require('../../controllers/GuildLol');

exports.run = async (client, message, args) => {
  let guildController = new GuildController();
  let guildLolController = new GuildLolController(message.guild.id);
  
  try {
    let guildDataPromise = guildController.getGuild(message.guild.id);
    let guildMaestryRolesPromise = guildLolController.getRoles();
    const [guildData, guildMaestryRoles] = await Promise.all([guildDataPromise, guildMaestryRolesPromise]);
    
    let allRoles = [];
    guildMaestryRoles.forEach(maestryRole => {
      let role = message.member.guild.roles.cache.find(role => role.id === maestryRole.role);

      allRoles.push(`Maestria: ${maestryRole.points}\nRole ganha: ${role.name}`);
    });

    if(allRoles.length == 0) allRoles.push('Nenhuma');

    let embed = new Discord.MessageEmbed()
      .setTitle('Configurações de LoL do servidor.')
      .addField('**Champion**', `\`\`\`${guildData.lol_champion_role}\`\`\``, true)
      .addField(`**Roles ganhar por pontos de maestria com ${guildData.lol_champion_role}**`, `\`\`\`${allRoles.join('\n\n')}\`\`\``, false);

    message.channel.send({embed: embed});
  } catch(e) {
    console.log(`Erro ao mostrar embed.\n Comando: lolrole info.\n Server: ${message.guild.name}\n`, e);
  }
}