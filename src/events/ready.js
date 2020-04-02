module.exports = (client) => {
  console.log(`Ready to serve in ${client.channels.cache.size} channels on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users.`);
  
  let activitiesLength = Object.keys(client.config.activities).length;
  let randomNumber = Math.floor(Math.random() * activitiesLength);
  let typeActivity = client.config.activities[randomNumber].type;
  client.user.setActivity(client.config.activities[randomNumber].quote, {type: typeActivity})
    .catch(console.error);

  setInterval(() => {
    randomNumber = Math.floor(Math.random() * activitiesLength);
    let typeActivity = client.config.activities[randomNumber].type;
    client.user.setActivity(client.config.activities[randomNumber].quote, {type: typeActivity})
      .catch(console.error);
  }, 120000);
}