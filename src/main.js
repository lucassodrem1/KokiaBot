const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const client = new Discord.Client();
const config = require("../assets/config.json");
client.config = config;
module.exports.talkedRecently = new Set();

fs.readdir("./src/events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Enmap();

fs.readdir("./src/commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command ${commandName}`);
    client.commands.set(commandName, props);
  });
});

// Lendo comandos de todas as pastas dentro de customCommands.
fs.readdir("./src/customCommands/", (err, dirs) => {
  if (err) return console.error(err);
  dirs.forEach(dir => {
    fs.readdir(`./src/customCommands/${dir}/`, (err, files) => {
      files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./customCommands/${dir}/${file}`);
        let commandName = dir + ' ' + file.split(".")[0];
        console.log(`Attempting to load custom command ${commandName}`);
        client.commands.set(commandName, props);
      });
    });
  });
});

client.login(process.env.token);