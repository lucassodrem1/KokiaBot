const UserController = require('../controllers/User');
const GuildController = require('../controllers/Guild');
const GuildFilterController = require('../controllers/GuildFilter');
const { customCommandReplace } = require('../utils/customCommandReplace');
const { talkedRecently } = require('../main');

module.exports = async (client, message) => {
  if (message.author.bot) return;

  // Verificar se é comando no dm channel.
  if(!message.guild){
    // Verificar se usuário quer usar help na dm.
    if(message.content.startsWith('k!help') || message.content.startsWith('k!h')) {
      const args = message.content.slice(2).trim().split(/ +/g);
      args.shift();
      const cmd = client.commands.get('help');
      return cmd.run(client, message, args);
    }
    return message.channel.send('Apenas o comando k!help pode ser usado na DM.');
  } 

  let guildId = message.guild.id;

  let guildController = new GuildController();
  let guildData = await guildController.getGuild(guildId);

  // Verificar se a guild está no banco de dados.
  // Se não estiver, criar guilda no banco de dados.
  if(!guildData) {
    guildController.addGuild(guildId, client.config.prefix);
    guildController.addGuildLevelSystem(guildId, client.config);
    guildController.addGuildWelcome(guildId, client.config);

    guildData = await guildController.getGuild(guildId);
  }

  // Executar comandos normais.
	if (message.content.toLowerCase().indexOf(guildData.prefix.toLowerCase()) === 0) {
    const args = message.content.slice(guildData.prefix.length).trim().split(/ +/g);
    
    // Verificar se o comando possui uma palavra ou duas.
    // Pega os dois primeiros argumentos, se formarem o nome de um file,
    // o comando existe. Se não existir, executa o comando de uma palavra.
    let command = null;
    if(client.commands.get(args[0] + ' ' + args[1])) {
      command = args.splice(0, 2).join(' ').toLowerCase();
    } else {
      command = args.shift().toLowerCase();
    }
    
    const cmd = client.commands.get(command) 
      || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

    if(cmd) return cmd.run(client, message, args);
  }

  //Executar comandos customizados criados pelos servidores.
  if (message.content.toLowerCase().indexOf(guildData.prefix.toLowerCase()) === 0) {
    let customCommandArgs = message.content.slice(guildData.prefix.length).trim().split(/ +/g);
    let customCommand = customCommandArgs.shift().toLowerCase();

    // Pegar comandos no servidor.
    let guildCustomCommands = await guildController.getCustomCommandsByGuild(guildId);

    // Verificar se existe o comando no servidor.
    let guildCustomCommand = guildCustomCommands.find(customCommands => customCommands.command == customCommand);
    
    // Resposta do comando.
    if(guildCustomCommand) {
      let response = await customCommandReplace(message, customCommand, guildCustomCommand.response);
      return message.channel.send(response);
    }
  }

  // SISTEMA DE FILTRO 
  // Filtrar caso não seja adm e tenha algum filtro.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    // Pegar informações de canais ignorados por filtros no server.
    let guildFilterController = new GuildFilterController(guildId);
    let guildFilter = await guildFilterController.getGuildFilter();
    let ignoreChannels = await guildFilterController.getIgnoreChannelsByGuildId();

    // Verificar se canal não está na lista de canais ignorados pelo filtro no server.
    let isIgnoreChannel = ignoreChannels.find(channel => channel.channel_id == message.channel.id);
    if(!isIgnoreChannel) {
      
      // Filtrar termos bloqueados no servidor.
      if(guildFilter.filter_term) {
        // Pegar termos.
        let blockedTerms = await guildFilterController.getBlockedTerm();

        // Verificar se mensagem tem termos bloqueados.
        let hasBlockedTerm = await guildFilterController.checkMessageTerms(message, blockedTerms);
        
        // Apagar mensagem.
        if(hasBlockedTerm) {
          // Adicionar pontos de penalização ao usuário.
          await guildFilterController.addPenaltyPoints(message.author.id, hasBlockedTerm.weight);
          // Pegar info do usuário de penalidades.
          let userPenaltyInfo = await guildFilterController.getPenaltyPointsByUser(message.author.id);

          // Mandar log caso tiver channel setado.
          if(guildFilter.log_channel != 0) {
            guildFilterController.sendPenaltyLog(message, guildFilter.log_channel, userPenaltyInfo.penalty_points);
          }

          // Verificar se usuário precisa ser mutado.
          await guildFilterController.checkIfisToMute(message, guildFilter, userPenaltyInfo);

          return message.delete();
        }
      }

      // Filtar imagens e vídeos.
      if(guildFilter.filter_attach) {
        if(message.attachments.size > 0) {
          message.delete();
          return;
        };
      }

      // Filtrar link.
      if(guildFilter.filter_link) {
        // Regex para links.
        let urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
        if(message.content.match(urlRegex)) {
          message.delete();
          return;
        }
      }
    }
  }
  
  // Sistema de level.
  let userId = message.author.id;
  
  let guildLevelSystem = await guildController.getGuildLevelSystem(guildId);

  // Verificar se sistema de level está ativado.
  if(guildLevelSystem.status != 0) {
    // Verificar se usuário tem role para não ganhar xp.
    let haveMuteRole = message.member.roles.cache.find(role => role.id == guildData.blacklist_role);
    if(!haveMuteRole) {
      let userController = new UserController();
      try {
        // Verificar se user está no db.
        let userExists = await userController.checkIfUserExists(guildId, userId);
        if(!userExists) {
          await userController.addUser(guildId, userId);
        }
      } catch(e) {
        console.error(e);
      }
      
      // Verificar se está em tempo de cooldown.
      if(!talkedRecently.has(message.author.id)) {
        // Dar xp ao usuário ao mandar mensagem.
        userController.earnXp(userId, message);
        
        // Adicionar user no tempo de cooldown.
        talkedRecently.add(message.author.id);
        
        setTimeout(() => {
          talkedRecently.delete(message.author.id);
        }, 60000);
      }
    }
  }

  // Se mencionar o bot.
  if(message.content == `<@!${client.user.id}>`)
    message.channel.send(`Oi! Meu prefixo nesse servidor é **${guildData.prefix}**`);
}