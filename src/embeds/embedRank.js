module.exports.embedRank = function(Discord, message, user) {
    // Update nos valores do user para caso o mesmo upe
    // usando o comando de rank.
    if(user.current_xp_level >= user.nextXpLevel) {
        user.level += 1;
        user.current_xp_level -= user.nextXpLevel;
        user.nextXpLevel = 5 * (Math.pow(user.level, 2)) + 50 * user.level + 100;
    }
    
    var embed = new Discord.MessageEmbed()
        .setTitle(message.member.displayName)
        .setDescription(`**Level:** ${user.level} \n**Exp:** ${user.current_xp_level} / ${user.nextXpLevel}\n**Rank:** ${user.ranking}º`)
        .setColor(0xf33434)
        .setThumbnail(message.author.displayAvatarURL());

    message.channel.send({embed: embed});
}