const Discord = require("discord.js");
const AdminController = require('../../controllers/Admin');
const GuildFilterController = require('../../controllers/GuildFilter');

module.exports = {
  name: 'term add',
  description: 'Adicione um termo na lista de termos bloqueados.',
  category: '👮‍♀️ Moderação',
  usage: '<termo>',
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

    if(!args[0]) return message.channel.send('Adicione um termo para ser bloqueado.');

    let term = args.join(' ');
    let weight = 1;

    if(term.length > 1000) return message.channel.send('O termo só pode ter até 1000 caracteres.');

    // Verificar se ultimo argumento é um número entre 1 e 3.
    if(args[args.length - 1] >= 1 && args[args.length - 1] <= 3) {
      term = args.splice(0, args.length - 1).join(' ');
      weight = args[0];
    }

    try{
      let guildFilterController = new GuildFilterController(message.guild.id);

      // Pegar número de termos existentes na guild.
      let blockedTerms = await guildFilterController.getBlockedTerm();

      // Verificar se já atingiu o limite de termos no servidor.
      if(blockedTerms.length >= 100) return message.channel.send('O servidor só pode ter 100 termos bloqueados.');
      
      // Adicionar termo.
      await guildFilterController.addBlockedTerm(message, blockedTerms.length + 1, term, weight);

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

      message.channel.send(`Termo adicionado à lista de termos bloqueados!`);
    } catch(e) {
      console.log(`Erro ao adicionar term.\n Comando: term add.\n Server: ${message.guild.name}\n`, e);
    }
  }
}