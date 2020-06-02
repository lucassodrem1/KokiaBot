const { client } = require('../../sql/config.js');

module.exports = class GuildFilter {
  guildId;

  constructor(guildId) {
    this.guildId = guildId;
  }

  addGuildFilter() {
    return new Promise((resolve, reject) => {
      client.query(`INSERT INTO guild_filter (guild_id) VALUES (${this.guildId});`, 
      err => {
        if(err) return reject(err);

        return resolve();
      });
    });
  }

  getGuildFilter() {
    return new Promise((resolve, reject) => {
      client.query(`SELECT * FROM guild_filter WHERE guild_id = ${this.guildId};`, (err, results) => {
        if(err) return reject(err);

        return resolve(results.rows[0]);
      }); 
    });
  }

  updateInfo(updateField, value) {
    return new Promise((resolve, reject) => {
      client.query(`UPDATE guild_filter SET ${updateField} = '${value}' WHERE guild_id = ${this.guildId};`, err => {
        if(err) return reject(err);

        return resolve();
      });
    });
  }
}