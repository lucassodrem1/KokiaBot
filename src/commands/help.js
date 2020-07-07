const Discord = require("discord.js");
const GuildController = require('../controllers/Guild');

const categories = [
  '📜 Informações',
  '👋 Boas-vindas',
  '📱 Divulgação',
  '🧙 XP & Leveling',
  '👷‍♀️ Comandos customizados',
  '👮‍♀️ Moderação',
  '🎮 Jogos',
  '😝 4fun',
  '✍ Auto Role',
  '💬 Outros Comandos'
]

module.exports = {
  name: 'help',
  description: 'Exibe informações dos comandos.',
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
        .setFooter('Bot feito com ❤️');

      // Pegar comandos das categorias
      categories.forEach(category => {
        let infoCommands = commands.filter(command => command.category == category);
        infoCommands = infoCommands.map(command => `• ${command.name} ${command.usage || ''}`);
        embed.addField(category, infoCommands.join('\n'), true);
      });

      // Informações extras.
      embed.addField('_ _', `Para ver a documentação completa, veja meu [guia](https://lucassodrem.gitbook.io/kokiabot/)!
        Dúvidas, sugestões ou feedbacks? Entre no [servidor da Kokia](https://discord.gg/Y4CewPU)!`, false)

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