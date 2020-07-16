const Discord = require("discord.js");
const AdminController = require('../../controllers/Admin');
const GuildFilterController = require('../../controllers/GuildFilter');

module.exports = {
  name: 'term remove',
  description: 'Remove um termo na lista de termos bloqueados.',
  category: '👮‍♀️ Moderação',
  usage: '<número>',
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

    if(!args[0]) return message.channel.send('Selecione o número de um termo ou **all** para remover todos!');
    let guildFilterController = new GuildFilterController(message.guild.id);

    if(args[0] === 'all') {
      try {
        // Remover termo.
        await guildFilterController.removeAllBlockedTerms(message);

        // Registrar log se for ação de um usuário privilegiado.
        if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
          AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

        return message.channel.send(`Termos removidos da lista de termos bloqueados!`);
      } catch(e) {
        console.log(`Erro ao remover term.\n Comando: term remove.\n Server: ${message.guild.name}\n`, e);
      }
    }

    let number = args[0];
    if(isNaN(number)) return message.channel.send('Selecione o número de um termo ou **all** para remover todos!');

    try{

      // Remover termo.
      await guildFilterController.removeBlockedTerm(message, number);

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

      message.channel.send(`Termo removido da lista de termos bloqueados!`);
    } catch(e) {
      console.log(`Erro ao remover term.\n Comando: term remove.\n Server: ${message.guild.name}\n`, e);
    }
  }
}