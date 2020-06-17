const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }
  
  let level = args[0];
  let role = message.mentions.roles.first();
  let levelMessage = args.splice(2).join(' ');

  if(!level) return message.channel.send('Você precisa definir um level!');

  if(level < 0) return message.channel.send('Você precisa definir um level maior que 0!');

  if(!role) return message.channel.send('Você precisa escolher uma role válida!');
  
  if(levelMessage.length > 120) return message.channel.send('Mensage só pode conter até 120 caracteres!');

  try{
    let guildController = new GuildController();
    let guildCustomLevels = await guildController.getCustomLevels(message.guild.id);

    // Verifica se usuário está tentando adicionar um nome level custom já estando com o limite max definido.
    if(!guildCustomLevels.find(customLevel => customLevel.level == level)) {
      if(guildCustomLevels.length >= 10) return message.channel.send('Você só pode ter até 10 levels customizados!');
    }

    await guildController.addCustomLevels(message.guild.id, level, role.id, levelMessage); 

    message.channel.send(`Level customizado definido!`);
  } catch(e) {
    console.log(`Erro ao adicionar custom level.\n Comando: customlevel add.\n Server: ${message.guild.name}\n`, e);
  }
}