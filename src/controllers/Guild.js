const { client } = require('../../sql/config.js');

module.exports = class Guild {
  addGuild(guildId, prefix) {
    client.query(`INSERT INTO guilds (guild_id, prefix) VALUES (${guildId}, '${prefix}');`,
      err => {
        if (err) throw err;
      }
    );
  }

  deleteGuild(guildId) {
    client.query(`DELETE FROM guilds WHERE guild_id = ${guildId}`,
      err => {
        if (err) throw err;
      }
    );
  }
}