module.exports.embedRank = function(Discord, message, user) {
    var embed = new Discord.MessageEmbed()
        .setTitle(message.member.displayName)
        .setDescription(`**Level:** ${user.level} \n**Exp:** ${user.current_xp_level} / ${user.nextXpLevel}\n**Rank:** ${user.ranking}º`)
        .setColor(0x00AE86)
        .setThumbnail(message.member.user.avatarURL());

    message.channel.send({embed: embed});
}