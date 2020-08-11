const  GuildLolController = require('../../controllers/GuildLol');
const { deleteMutedUser } = require('../../controllers/GuildFilter');


module.exports = {
  name: 'lol delete',
  description: 'Deleta suas informações de lol na Kokia.',
  category: '🎮 Jogos',
  async run (client, message, args) {
    try {
      let guildLolController = new GuildLolController(message.author.id);
      let isDeleted = await guildLolController.deleteAccountByUserId();
      
      if(!isDeleted) return message.channel.send(`<@${message.author.id}>, você não tem um perfil cadastrado!`);

      message.channel.send(`<@${message.author.id}>, seu perfil foi deletado.`);
    } catch(e) {
      console.log(`Erro ao deletar perfil.\n Comando: lol delete.\n Server: ${message.guild.name}\n`, e);
      message.channel.send(`<@${message.author.id}>, seu perfil não pôde ser deletada, tente novamente.`);
    }
  }
}
  