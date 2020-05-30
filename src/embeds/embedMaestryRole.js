const GuildLolController = require('../controllers/GuildLol');
const GuildController = require('../controllers/Guild');

module.exports.embedMaestryRole = async function(Discord, message) {
  let guildLolController = new GuildLolController(message.guild.id);
  let guildController = new GuildController();

  try {
    let guildData = await guildController.getGuild(message.guild.id);

    let guildMaestryRoles = await guildLolController.getRoles();

    let embed = new Discord.MessageEmbed()
        .setColor(0xf33434)
        .setThumbnail(message.guild.iconURL)
        .setTitle(`Roles dadas por maestria com **${guildData.lol_champion_role}**`);

    guildMaestryRoles.forEach(maestryRole => {
      let role = message.member.guild.roles.cache.find(role => role.id === maestryRole.role);

      embed.addField(`Maestria: ${maestryRole.points}`, `Role ganha: ${role.name}`, false)
    });

    message.channel.send({embed: embed});
  } catch(e) {
      console.error(e);
  }
}