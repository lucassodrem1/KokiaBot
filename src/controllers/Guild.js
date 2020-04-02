const { client } = require('../../sql/config.js');

module.exports = class Guild {
  addGuild = (guildId, prefix) => {
    client.query(`INSERT INTO guilds (guild_id, prefix) VALUES (${guildId}, '${prefix}');`,
      err => {
        if (err) throw err;
      }
    );
  }
}