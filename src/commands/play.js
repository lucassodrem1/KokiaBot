module.exports = {
  name: 'play',
  description: 'Reproduza áudios de streamers.',
  category: '😝 4fun',
  usage: '<streamer> <áudio>',
  run(client, message, args) {
    let voiceChannel = message.member.voice.channel;
    let name = args[0];
    let audio = args[1];
    
    audioConfigs = {
      volume: 6
    };

    if(client.config.audios[name] === undefined || client.config.audios[name][audio] === undefined) {
      return message.channel.send('Ops... Esse áudio não existe!');
    }

    if (!voiceChannel) 
      return message.channel.send("Você deve estar em um canal de voz!");

    if(!voiceChannel.joinable) return message.channel.send("Kokia não tem permissão para entrar na sala.");

    voiceChannel.join()
    .then(connection => {
      const dispatcher = connection.play(client.config.audios[name][audio].link);
      dispatcher.setVolumeLogarithmic(audioConfigs.volume / 5);

      dispatcher.on('finish', () => {
        connection.disconnect();
      });

      dispatcher.on('error', error => {
        console.log(error);
      });
    })
    .catch(e => {
      console.error(`Erro ao começar áudio.\n Comando: play.\n Server: ${message.guild.name}\n`, e);
    });  
  }    
};