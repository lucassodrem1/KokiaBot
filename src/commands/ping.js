const Discord = require("discord.js");

module.exports = {
  name: 'ping',
  description: 'Exibe informação da latência da Kokia.',
  category: '📜 Informações',
  run(client, message, args) {
    message.channel.send('Pingando...')
    .then(m => {
      let ping = m.createdTimestamp - message.createdTimestamp;

      m.edit(`Latência da Kokia: ${ping}`);
    });
  }
}