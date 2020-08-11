const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');
const AdminController = require('../../controllers/Admin');

module.exports = {
  name: 'customlevel add',
  description: 'Adiciona um level customizado.',
  category: '🧙 XP & Leveling',
  usage: '<level> <role> [message]',
  permission: 'Administrador',
  async run(client, message, args) {
    // Pegar usuários privilegiados.
    let privilegedUsers = await AdminController.getPrivilegedUsers();
    let isPrivilegedUser = privilegedUsers.find(privilegedUser => privilegedUser.user_id == message.author.id);

    // Verificar se usuário é um administrador.
    if(!message.member.hasPermission('ADMINISTRATOR')) {
      // Verificar se é usuário privilegiado.
      if(!isPrivilegedUser) return message.channel.send('Você precisa ser um administrador para usar este comando!');
    }
    
    let level = args[0];
    let role = message.mentions.roles.first();
    let levelMessage = args.splice(2).join(' ');

    if(!level) return message.channel.send('Você precisa definir um level!');

    if(level < 0) return message.channel.send('Você precisa definir um level maior que 0!');

    if(!role) return message.channel.send('Você precisa escolher uma role válida!');
    
    if(levelMessage.length > 120) return message.channel.send('Mensagem só pode conter até 120 caracteres!');

    try{
      let guildController = new GuildController();
      let guildCustomLevels = await guildController.getCustomLevels(message.guild.id);

      // Verifica se usuário está tentando adicionar um nome level custom já estando com o limite max definido.
      if(!guildCustomLevels.find(customLevel => customLevel.level == level)) {
        if(guildCustomLevels.length >= 10) return message.channel.send('Você só pode ter até 10 levels customizados!');
      }

      await guildController.addCustomLevels(message.guild.id, level, role.id, levelMessage); 

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

      message.channel.send(`Level customizado definido!`);
    } catch(e) {
      message.channel.send('Não foi possível adicionar o level customizado.\nEntre em contato com a gente para reportar um possível bug!');
      console.log(`Erro ao adicionar custom level.\n Comando: customlevel add.\n Server: ${message.guild.name}\n`, e);
    }
  }
}