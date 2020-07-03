const { client } = require('../../sql/config.js');

module.exports = class Admin {
  static getPrivilegedUsers() {
    return new Promise((resolve, reject) => {
      client.query(`SELECT user_id FROM privileged_users;`, 
      (err, results) => {
        if(err) return reject(err);

        return resolve(results.rows);
      });
    });
  }

  static async addPrivilegedUserLog(userId, guildId, command) {
    client.query(`INSERT INTO privileged_users_logs (user_id, guild_id, command) VALUES 
    (${userId}, ${guildId}, '${command}');`, err => {
      if(err) throw err;
    });
  }
}