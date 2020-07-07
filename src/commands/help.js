const Discord = require("discord.js");
const GuildController = require('../controllers/Guild');

module.exports = {
  name: 'help',
  description: 'Exibe informação dos comandos.',
  category: '📜 Informações',
  usage: '[comando]',
  aliases: ['h'],
  async run(client, message, args) {
    const { commands } = client;
    let guildController = new GuildController();
    let guildData = await guildController.getGuild(message.guild.id);

    if(!args.length) {
      // Mostrar todos os comandos.
      let embed = new Discord.MessageEmbed()
        .setTitle('Lista de todos os meus comandos')
        .setDescription(`Você pode usar **${guildData.prefix}help [comando]** para ter informações sobre um comando específico!`)
        .setColor(0xf33434)
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter('Bot feito com ❤️.');

      // Pegar comandos da categoria 📜 Informações.
      let infoCommands = commands.filter(command => command.category == '📜 Informações');
      infoCommands = infoCommands.map(command => `• ${command.name} ${command.usage || ''}`);
      embed.addField('📜 Informações', infoCommands.join('\n'), true);

      // Pegar comandos da categoria 🧙 XP & Leveling.
      let levelingCommands = commands.filter(command => command.category == '🧙 XP & Leveling');
      levelingCommands = levelingCommands.map(command => `• ${command.name} ${command.usage || ''}`);
      embed.addField('🧙 XP & Leveling', levelingCommands.join('\n'), true);

      return message.channel.send({ embed: embed, split: true })
        .catch(console.error);
    }

    // Mostrar comando específico.
    const name = args.join(' ').toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if(!command) return message.channel.send('Esse comando não existe.');

    let aliases = command.aliases ? command.aliases.join(', ') : 'Nenhum';

    let embed = new Discord.MessageEmbed()
      .setAuthor(command.category)
      .setTitle(command.name)
      .setColor(0xf33434)
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(`${command.description}\n\nUso: ${guildData.prefix}${command.name} ${command.usage || ''}\n\nAtalho(s): ${aliases}`);
    
      if(command.permission) {
        embed.setFooter(`⚠️ Esse comando requer permissão: ${command.permission}`);
      }

    message.channel.send({ embed: embed, split: true })
      .catch(console.error);
  }
}