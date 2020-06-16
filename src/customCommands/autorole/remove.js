const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }
  
  let guildController = new GuildController();

  try {
    //Verificar se existe joinrole.
    let guildData = await guildController.getGuild(message.guild.id);
    if(guildData.join_role === '0') {
        return message.channel.send('Nenhuma auto role foi atribuida ainda!');
    }

    await guildController.updateInfo(message.guild.id, 'join_role', 0);

    message.channel.send('Auto role removida!');
  } catch(e) {
    console.log(`Erro ao remover join role.\n Comando: joinrole remove.\n Server: ${message.guild.name}\n`, e);
  }
}