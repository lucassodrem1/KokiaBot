const Discord = require("discord.js");
const UserController = require('../controllers/User');
const GuildController = require('../controllers/Guild');
const { talkedRecently } = require('../main');

module.exports = async (client, message) => {
  if (message.author.bot) return;

  let guildId = message.member.guild.id;
  let userId = message.author.id;
  
  let guildController = new GuildController();
  let guildData = await guildController.getGuild(guildId);
  
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

  // Executar comandos normais.
	if (message.content.indexOf(guildData.prefix) !== 0) return;

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
  
	const cmd = client.commands.get(command);

	if (!cmd) return;

	cmd.run(client, message, args);
}