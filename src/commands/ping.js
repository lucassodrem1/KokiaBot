const Discord = require("discord.js");

exports.run = (client, message, args) => {
  message.channel.send('Pingando...')
  .then(m => {
    let ping = m.createdTimestamp - message.createdTimestamp;

    m.edit(`Latência do bot: ${ping}`);
  });
}