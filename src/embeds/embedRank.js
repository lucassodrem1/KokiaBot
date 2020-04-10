module.exports.embedRank = function(Discord, message, user) {
    var embed = new Discord.MessageEmbed()
        .setTitle(user.displayName)
        .setDescription(`**Level:** ${user.level} \n**Exp:** ${user.current_xp_level} / ${user.nextXpLevel}\n**Rank:** ${user.ranking}º`)
        .setColor(0xf33434)
        .setThumbnail(user.avatar);

    message.channel.send({embed: embed});
}