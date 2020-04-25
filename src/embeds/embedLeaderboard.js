const UserController = require('../controllers/User');

module.exports.embedLeaderboard = async function(Discord, message) {
    let userController = new UserController();
    try {
        let rankData = await userController.getUsersRank(message.guild.id, 10);

        let leadOutp = rankData.map((data, index) => {
            username = message.guild.member(data.user_id);

            let position = index + 1;
            return [`${position}º **${username.displayName}** Level: **${data.level}** ${data.current_xp_level}/${data.nextXpLevel}`];
        });

        let leadOut = leadOutp.join("\n\n");
        
        let embed = new Discord.MessageEmbed()
            .setColor(0xf33434)
            .setThumbnail(message.guild.iconURL)
            .addField(`**${message.guild.name}** Top 10`, `${leadOut}`, true);

        message.channel.send({embed: embed});
    } catch(e) {
        console.error(e);
    }
}