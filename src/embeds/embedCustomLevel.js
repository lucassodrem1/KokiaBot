const GuildController = require('../controllers/Guild');

module.exports.embedCustomLevel = async function(Discord, message) {
    let guildController = new GuildController();
    try {
        let guildCustomLevels = await guildController.getCustomLevels(message.guild.id);

        let embed = new Discord.MessageEmbed()
            .setColor(0xf33434)
            .setThumbnail(message.guild.iconURL)
            .setTitle(`Levels customizados em ${message.guild.name}`);

        guildCustomLevels.forEach(customLevel => {
          let role = message.member.guild.roles.cache.find(role => role.id === customLevel.role);

          embed.addField(`Level **${customLevel.level}**`, `Role ganha: ${role.name}\nMensagem: ${customLevel.message}`, false)
        });

        message.channel.send({embed: embed});
    } catch(e) {
        console.error(e);
    }
}