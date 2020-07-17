const GuildFilterController = require('../../controllers/GuildFilter');
const AdminController = require('../../controllers/Admin');

module.exports = {
  name: 'filter link',
  description: 'Habilita/desabilita filtro de links no servidor.',
  category: '👮‍♀️ Moderação',
  usage: '<on/off>',
  permission: 'Administrador',
  async run(client, message, args) {
    try {
      // Pegar usuários privilegiados.
      let privilegedUsers = await AdminController.getPrivilegedUsers();
      let isPrivilegedUser = privilegedUsers.find(privilegedUser => privilegedUser.user_id == message.author.id);

      // Verificar se usuário é um administrador.
      if(!message.member.hasPermission('ADMINISTRATOR')) {
        // Verificar se é usuário privilegiado.
        if(!isPrivilegedUser) return await message.channel.send('Você precisa ser um administrador para usar este comando!');
      }

      if(!args[0]) return await message.channel.send('Escolha uma opção entre **on** e **off**.');
      
      let option = args[0].toLowerCase();
      let successMessage = 'Filtro de link ativado!';

      if(option === 'on') {
        option = 1;    
      } else if(option === 'off') {
        option = 0;
        successMessage = 'Filtro de link desativado!';
      } else {
        return await message.channel.send('Escolha uma opção entre **on** e **off**.');
      }

      let guildFilterController = new GuildFilterController(message.guild.id);
      await guildFilterController.updateInfo('filter_link', option);

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('ADMINISTRATOR')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
      
      await message.channel.send(successMessage);
    } catch(e) {
      if(e.message !== 'Missing Permissions')
        console.log(`Erro filtrar link.\n Comando: filter link.\n Server: ${message.guild.name}\n`, e);
    }
  }
}