const Discord = require("discord.js");
const https = require('https');
const conditions = require('../../assets/conditions.json');

module.exports = {
  name: 'temp',
  description: 'Exibe o clima de uma cidade e a previsão para o dia seguinte.',
  category: '💬 Outros Comandos',
  usage: '<cidade>',
  async run(client, message, args) {
    let city = args.join(' ');
    
    if(!city) return message.channel.send("Escolha uma cidade.");

    https.get(`https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_TOKEN}&q=${city}&days=2&lang=pt`, res => {
      let output = '';
      let data;

      res.on('data', chunck => {
        output += chunck;
      });

      res.on('end', () => {
        let data = JSON.parse(output);  
        
        // Verificar se cidade existe.
        if(data.error) return message.channel.send('Cidade não encontrada.');

        // Verificar se é dia ou noite e depois verificar o codigo da imagem.
        let time = data.current.condition.icon.split('/')[5];
        let images = conditions[time][data.current.condition.code];
        let randomImage = Math.floor(Math.random() * images.length); 

        let embed = new Discord.MessageEmbed()
          .setTitle(`${data.location.name} - ${data.location.country}`)
          .setDescription(`**${data.current.condition.text} - ${data.current.temp_c}°C**\nSensação de ${data.current.feelslike_c}°C`)
          .setThumbnail('https:'+data.current.condition.icon)
          .addField('Umidade', `${data.current.humidity}%`, true)
          .addField('Chance de chuva', `${data.forecast.forecastday[0].day.daily_chance_of_rain}%`, true)
          .addField('Vento', `${data.current.wind_kph}km/h`, true)
          .addField('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -', '_ _', false)
          .addField('Previsão para amanhã', '_ _', false)
          .addField('Temperatura', `${data.forecast.forecastday[1].day.mintemp_c}°C - ${data.forecast.forecastday[1].day.maxtemp_c}°C\nMédia: ${data.forecast.forecastday[1].day.avgtemp_c}°C`, true)
          .addField('Umidade', `${data.forecast.forecastday[1].day.avghumidity}%`, true)
          .addField('Chance de chuva', `${data.forecast.forecastday[1].day.daily_chance_of_rain}%`, true)
          .setImage(images[randomImage])
          .setTimestamp();

        message.channel.send(embed);
      });

      res.on('error', e => {
        message.channel.send('Erro ao tentar obter a temperatura, tente novamente.');
        console.log(`Erro ao mostrar temperatura.\n Comando: temp.\n Server: ${message.guild.name}\n`, e);
      });
    });
  }
}