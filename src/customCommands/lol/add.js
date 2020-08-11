const  GuildLolController = require('../../controllers/GuildLol');
const lolChampions = require('../../../assets/lol/champions.json');

module.exports = {
  name: 'lol add',
  description: 'Cadastra suas informações de lol na Kokia.',
  category: '🎮 Jogos',
  usage: '<opção> <texto>',
  async run (client, message, args) {
    if(!args.length) 
      return message.channel.send('Escolha um campo válido. Se está precisando de ajuda, use o comando **lol help**!');

    let option = args.splice(0, 1)[0].toLowerCase();

    let data = {
      userId: message.author.id,
      nick: '',
      elo: 'indefinido',
      role: 'indefinida',
      description: '',
      main: 'indefinido',
      like_main: 'indefinido'
    };

    // Adicionar nick.
    if(option === 'nick') {
      let nick = args.join(' ');

      if(nick.length > 16) return message.channel.send(`<@${message.author.id}>, o nome de invocador só pode ter até 16 caracteres.`);

      try {
        data.nick = nick;
        await GuildLolController.addAccount(data, 'nick', nick);
        
        return message.channel.send(`<@${message.author.id}>, nick definido!`);
      } catch(e) {
        message.channel.send(`<@${message.author.id}>, algo estranho aconteceu, tente novamente.`);
        console.log(`Erro ao adicionar nick.\n Comando: lol add.\n Server: ${message.guild.name}\n`, e);
      }
    }

    // Adicionar elo.
    if(option === 'elo') {
      let elo = args[0].toLowerCase();
      const availlableElos = ['ferro', 'bronze', 'prata', 'gold', 'platina', 'diamond', 'mestre', 'gm', 'challenger'];

      // Verificar se é um elo válido.
      if(!availlableElos.find(availlableElo => availlableElo === elo)) 
        return message.channel.send(`<@${message.author.id}>, elo inválido. Elos válidos: ${availlableElos.join(', ')}.`);
        
      try {
        data.elo = elo;
        await GuildLolController.addAccount(data, 'elo', elo);
        
        return message.channel.send(`<@${message.author.id}>, elo definido!`);
      } catch(e) {
        message.channel.send(`<@${message.author.id}>, algo estranho aconteceu, tente novamente.`);
        console.log(`Erro ao adicionar elo.\n Comando: lol add.\n Server: ${message.guild.name}\n`, e);
      }
    }

    // Adicionar role.
    if(option === 'role') {
      let role = args[0].toLowerCase();
      const availlableRoles = ['top', 'jungle', 'mid', 'adc', 'sup'];

      // Verificar se é uma role válida.
      if(!availlableRoles.find(availlableRole => availlableRole === role)) 
        return message.channel.send(`<@${message.author.id}>, role inválida. Roles válidas: ${availlableRoles.join(', ')}.`);
        
      try {
        data.role = role;
        await GuildLolController.addAccount(data, 'role', role);
        
        return message.channel.send(`<@${message.author.id}>, role definida!`);
      } catch(e) {
        message.channel.send(`<@${message.author.id}>, algo estranho aconteceu, tente novamente.`);
        console.log(`Erro ao adicionar role.\n Comando: lol add.\n Server: ${message.guild.name}\n`, e);
      }
    }

    // Adicionar descrição.
    if(option === 'desc') {
      let desc = args.join(' ');
      
      if(desc.length > 120) return message.channel.send(`<@${message.author.id}>, a descrição só pode ter até 120 caracteres.`);

      try {
        data.desc = desc;
        await GuildLolController.addAccount(data, 'description', desc);
        
        return message.channel.send(`<@${message.author.id}>, descrição definida!`);
      } catch(e) {
        message.channel.send(`<@${message.author.id}>, algo estranho aconteceu, tente novamente.`);
        console.log(`Erro ao adicionar desc.\n Comando: lol add.\n Server: ${message.guild.name}\n`, e);
      }
    }

    // Adicionar main champion.
    if(option === 'main') {
      let main = args.join(' ').toLowerCase();
      
      // Verificar se é um campeão válido.
      if(!lolChampions.find(champion => champion.name.toLowerCase() === main))
        return message.channel.send(`<@${message.author.id}>, escolha um campeão válido.`);

      try {
        data.main = main;
        await GuildLolController.addAccount(data, 'main', main);
        
        return message.channel.send(`<@${message.author.id}>, main definido!`);
      } catch(e) {
        message.channel.send(`<@${message.author.id}>, algo estranho aconteceu, tente novamente.`);
        console.log(`Erro ao adicionar main.\n Comando: lol add.\n Server: ${message.guild.name}\n`, e);
      }
    }

    // Adicionar champion que o usuário gosta.
    if(option === 'like') {
      let likeMain = args.join(' ').toLowerCase();
      
      // Verificar se é um campeão válido.
      if(!lolChampions.find(champion => champion.name.toLowerCase() === likeMain))
        return message.channel.send(`<@${message.author.id}>, escolha um campeão válido.`);

      try {
        data.like_main = likeMain;
        await GuildLolController.addAccount(data, 'like_main', likeMain);
        
        return message.channel.send(`<@${message.author.id}>, gosto definido!`);
      } catch(e) {
        message.channel.send(`<@${message.author.id}>, algo estranho aconteceu, tente novamente.`);
        console.log(`Erro ao adicionar like main.\n Comando: lol add.\n Server: ${message.guild.name}\n`, e);
      }
    }

    message.channel.send('Escolha um campo válido. Se está precisando de ajuda, use o comando **lol help**!');
  }
}