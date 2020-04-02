const { client } = require('../../sql/config.js');

module.exports = class Guild {
  addUser = (guildId, userId) => {
    client.query(`INSERT INTO guild_users (guild_id, user_id) VALUES (${guildId}, ${userId});`,
      err => {
        if (err) throw err;
      }
    );
  }
}