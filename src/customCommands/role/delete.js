const AdminController = require('../../controllers/Admin');

module.exports = {
  name: 'role delete',
  description: 'Deleta uma role.',
  category: '👮‍♀️ Moderação',
  usage: '<role>',
  aliases: ['rd'],
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

    let role = message.mentions.roles.first();

    if(!role) return message.channel.send('Selecione alguma role.');

    try{
      await role.delete();

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

      message.channel.send(`Role **${role.name}** foi deletada!`);
    } catch(e) {
      console.log(`Erro ao deletar role.\n Comando: role delete.\n Server: ${message.guild.name}\n`, e);
    }
  }
}