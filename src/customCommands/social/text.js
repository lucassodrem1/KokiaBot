const Discord = require("discord.js");
const GuildController = require('../../controllers/Guild');
const AdminController = require('../../controllers/Admin');

const availablePlat = [
  'twitch',
  'youtube'
];

module.exports = {
  name: 'social text',
  description: 'Editar textos exibidos nos anúncios.',
  category: '📱 Divulgação',
  usage: '<plataforma> <username> <texto>',
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

    let platform = args[0];
    if(!platform) return message.channel.send('Escolha uma plataforma entre: twitch, youtube.');

    if(!availablePlat.find(plat => plat == platform)) return message.channel.send('Escolha uma plataforma entre: twitch, youtube.');

    let username = args[1];
    if(!username) return message.channel.send('Escolha um usuário.');

    let text = args.splice(2).join(' ');

    if(!text) return message.channel.send('Digite o texto que irá aparecer.');
    
    let guildController = new GuildController();
    try {
      let updated = await guildController.updateGuildSocialText(message.guild.id, platform, username, text);
      if(!updated) return message.channel.send(`Usuário **${username}** em **${platform}** não está cadastrado neste servidor.`);

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

      return message.channel.send(`Texto de anúncio de **${username}** em **${platform}** foi atualizado! Não se esqueça de definir um canal de anúncio!`);
    } catch(e) {
      console.log(`Erro ao editar texto.\n Comando: social text.\n Server: ${message.guild.name}\n`, e);
    }
  }
}