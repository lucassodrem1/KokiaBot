const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para alterar a mensagem!');
  }
  
  let guildController = new GuildController();

  try {
    //Verificar se existe joinrole.
    let guildData = await guildController.getGuild(message.guild.id);
    if(guildData.verify_role === '0') {
        return message.channel.send('Nenhuma role é atribuida ao verificar um usuário!');
    }

    await guildController.updateInfo(message.guild.id, 'verify_role', 0);

    message.channel.send('Role atribuida ao verificar usuário removida!');
  } catch(e) {
    console.error(e);
  }
}