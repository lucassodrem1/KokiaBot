const Discord = require("discord.js");
const AdminController = require('../../controllers/Admin');
const GuildFilterController = require('../../controllers/GuildFilter');

module.exports = {
  name: 'term show',
  description: 'Exibe a lista de termos bloqueados.',
  category: '👮‍♀️ Moderação',
  usage: '<número>',
  async run(client, message, args) {
    try{
      let guildFilterController = new GuildFilterController(message.guild.id);
      
      // Pegar termos.
      let blockedTerms = await guildFilterController.getBlockedTerm();
      
      let embed = new Discord.MessageEmbed()
        .setTitle('Termos bloqueados')
        .setColor(0xf33434)
        .addField('Nº', '_ _', true)
        .addField('Termo', '_ _', true)
        .addField('Peso', '_ _', true);
        
      // Formatar termos.
      blockedTerms.map(terms => {
        let term = terms.term.length > 40 ? terms.term.substring(0, 40)+'...' : terms.term;
        embed.addField('_ _', `**${terms.number}**`, true);
        embed.addField('_ _', term, true);
        embed.addField('_ _', terms.weight, true);
      });

      message.channel.send({embed: embed, split: true});
    } catch(e) {
      console.log(`Erro ao mostrar terms.\n Comando: term show.\n Server: ${message.guild.name}\n`, e);
    }
  }
}