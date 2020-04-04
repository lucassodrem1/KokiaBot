const Discord = require("discord.js");
const UserController = require('../controllers/User');
const GuildController = require('../controllers/Guild');
const { talkedRecently } = require('../main');

module.exports = async (client, message) => {
  if (message.author.bot) return;

  let guildId = message.member.guild.id;
  let userId = message.author.id;

  // Verificar se está em tempo de cooldown.
  if(talkedRecently.has(message.author.id)) return;
  
  // Adicionar user no tempo de cooldown.
  talkedRecently.add(message.author.id);
  setTimeout(() => {
    talkedRecently.delete(message.author.id);
  }, 500);

  let userController = new UserController();
  
  // Dar xp ao usuário ao mandar mensagem.
  userController.earnXp(guildId, userId, message);

  // Executar comandos normais.
  let guildController = new GuildController();
  let guildData = await guildController.getGuild(guildId);
	if (message.content.indexOf(guildData.prefix) !== 0) return;

  const args = message.content.slice(guildData.prefix.length).trim().split(/ +/g);
  
  // Verificar se o comando possui uma palavra ou duas.
  // Pega os dois primeiros argumentos, se formarem o nome de um file,
  // o comando existe. Se não existir, executa o comando de uma palavra.
  let command = null;
  if(client.commands.get(args[0] + '_' + args[1])) {
    command = (args[0] + '_' + args[1]).toLowerCase();
  } else {
    command = args.shift().toLowerCase();
  }

	const cmd = client.commands.get(command);

	if (!cmd) return;

	cmd.run(client, message, args);
}