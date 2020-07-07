const AdminController = require('../../controllers/Admin');

module.exports = {
  name: 'role color',
  description: 'Altera a cor de uma role.',
  category: '👮‍♀️ Moderação',
  usage: '<role> #<cor hex>',
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

    let roleColor = args[1];
    
    if(!role) return message.channel.send('Selecione alguma role.');

    if(!roleColor) return message.channel.send('Escolha a cor da role.');

    try{
      await role.setColor(roleColor);

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);

      message.channel.send(`Cor da role **${role.name}** foi alterada!`);
    } catch(e) {
      console.log(`Erro ao editar role.\n Comando: role color.\n Server: ${message.guild.name}\n`, e);
    }
  }
}