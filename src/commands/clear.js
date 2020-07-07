const AdminController = require('../controllers/Admin');

module.exports = {
  name: 'clear',
  description: 'Apaga mensagens do canal.',
  category: '👮‍♀️ Moderação',
  usage: '[quantidade]',
  permission: 'Gerencias mensagens',
  async run(client, message, args) {
    // Pegar usuários privilegiados.
    let privilegedUsers = await AdminController.getPrivilegedUsers();
    let isPrivilegedUser = privilegedUsers.find(privilegedUser => privilegedUser.user_id == message.author.id);

    // Verificar se usuário tem permissão.
    if(!message.member.hasPermission('MANAGE_MESSAGES')) {
      // Verificar se é usuário privilegiado.
      if(!isPrivilegedUser) return message.channel.send('Você precisa ter permissão de **gerenciar mensagens** para usar este comando!');
    }
    
    // Verificar se Kokia tem permissão.
    if(!message.guild.me.hasPermission('MANAGE_MESSAGES')) {
      return message.channel.send('Kokia precisa ter permissão de **gerenciar mensagens** para poder limpar o chat!');
    }

    let amount = 11;
    if(args[0]) {
      if(args[0] > 99) return message.channel.send('Você só pode apagar até 99 mensagens de uma vez.') 
      amount = args[0];
      amount++
    } 

    let text_response = ' mensagem foi apagada!';
    if ((amount - 1) > 1) {
      text_response = ' mensagens foram apagadas!';
    }

    message.channel.messages.fetch({limit: amount})
    .then(messages => {
      message.channel.bulkDelete(messages);

      // Registrar log se for ação de um usuário privilegiado.
      if(isPrivilegedUser && !message.member.hasPermission('MANAGE_MESSAGES')) 
        AdminController.addPrivilegedUserLog(message.author.id, message.guild.id, message.content);
    })
    .catch(e => console.error(`Erro ao apagar mensagem.\n Comando: clear.\n Server: ${message.guild.name}\n`, e));

    message.channel.send(`${amount - 1} ${text_response}`)
    .then(message => {
      message.delete({timeout: 3000});
    })
    .catch(e => {
      if(e.message !== 'Missing Permissions')
        console.error(`Erro ao mandar mensagem.\n Comando: clear.\n Server: ${message.guild.name}\n`, e)
    });
  }
}