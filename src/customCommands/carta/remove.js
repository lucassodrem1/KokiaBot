const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');

exports.run = async (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('ADMINISTRATOR')) {
    return message.channel.send('Você precisa ser um administrador para usar este comando!');
  }

  try{
    let guildController = new GuildController();
    await guildController.updateInfo(message.guild.id, 'elegant_mail_channel', 0); 

    message.channel.send(`Correio elegante desativado!`);
  } catch(e) {
    console.log(`Erro ao desativar correio eletante.\n Comando: carta remove.\n Server: ${message.guild.name}\n`, e);
  }
}