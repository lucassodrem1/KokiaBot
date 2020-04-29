const https = require("https");

module.exports.getGifs = function getGifs(Discord, message, searchTerm, text) {
    let apikey = process.env.gif_token;
    let lmt = 1;

    let search_url = `https://api.tenor.com/v1/random?q=${searchTerm}&key=${apikey}&limit=${lmt}&locale=en_US&media_filter=minimal`;

    https.get(search_url, res => {
      let output = '';
      let obj;
      res.on('data', chunk => {
        output += chunk;
      });

      res.on('end', () => {
        obj = JSON.parse(output);

        // Criando embed.
        let embed = new Discord.MessageEmbed()
          .setColor(0xf33434)
          .setDescription(text)
          // .attachFiles([obj.results[0].url])
          .setImage(obj.results[0].media[0].gif.url);

        message.channel.send({embed: embed});
      });

      res.on("error", function (error) {
        console.error(error);
      });
    });
}