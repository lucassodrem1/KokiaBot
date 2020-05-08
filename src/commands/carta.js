const Discord = require("discord.js");
const GuildController = require('../controllers/Guild');

exports.run = async (client, message, args) => {
  let guildController = new GuildController();
  try {
    let guildInfo = await guildController.getGuild(message.guild.id);
    
    // Identificando se correio elegante está ativo no server.
    let elegantEmail = guildInfo.elegant_mail_channel;
    if(elegantEmail == 0) return message.channel.send('Não existe um canal de correio elegante nesse servidor!');

    // Apenas ler o comando se estiver na sala do correio elegante.
    if(elegantEmail != message.channel.id) return;
    
    let member = message.mentions.members.first();
    
    let content = args.slice(1).join(' ');
    message.delete();
  
    if(!member) {
      message.channel.send(`Você precisa escolher um destinatário!`)
      .then(msg => {
        msg.delete({timeout: 3000});
      }).catch(err => console.log(err));
  
      return;
    }
  
    if(member.id == message.author.id) {
      message.channel.send('O negócio está tão feio para você ter que mandar carta para você mesmo?')
      .then(msg => {
        msg.delete({timeout: 5000});
      }).catch(err => console.log(err));
  
      return;
    }
  
    if(!content) {
      message.channel.send(`Você precisa escrever algo!`)
      .then(msg => {
        msg.delete({timeout: 3000});
      }).catch(err => console.log(err));
  
      return;
    }
  
    let embed = new Discord.MessageEmbed()
      .setColor(0xf33434)
      .setTitle('Correio elegante')
      .addField('Para', `<@${member.user.id}>`, true)
      .addField('Mensagem', content)
      .setTimestamp()
	    .setFooter('❤️ ❤️ ❤️', client.user.displayAvatarURL());

    message.channel.send({embed: embed});
    // message.channel.send(`Carta para: **<@${member.user.id}>**! \n ${content}`);
  } catch(e) {
    console.error(e);
  }
}