const Discord = require("discord.js");

exports.run = (client, message, args) => {
  // Verificar se usuário é um administrador.
  if(!message.member.hasPermission('MANAGE_MESSAGES')) {
    return message.channel.send('Você precisa ter permissão de **gerenciar mensagens** para usar este comando!');
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
  .then(messages => message.channel.bulkDelete(messages))
  .catch(e => console.error(`Erro ao apagar mensagem.\n Comando: clear.\n Server: ${message.guild.name}\n`, e));

  message.channel.send(`${amount - 1} ${text_response}`)
  .then(message => {
      message.delete({timeout: 3000});
    })
    .catch(e => console.error(`Erro ao mandar mensagem.\n Comando: clear.\n Server: ${message.guild.name}\n`, e));
};