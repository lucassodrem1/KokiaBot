const { client } = require('../../sql/config.js');

module.exports = class Guild {
  addUser = (guildId, userId) => {
    client.query(`INSERT INTO guild_users (guild_id, user_id) VALUES (${guildId}, ${userId});`,
      err => {
        if (err) throw err;
      }
    );
  }

  deleteUser = (guildId, userId) => {
    client.query(`DELETE FROM guild_users WHERE guild_id = ${guildId} AND user_id = ${userId}`,
      err => {
        if (err) throw err;
      }
    );
  }

  checkIfUserExists = (guildId, userId) => {
    return new Promise((resolve, reject) => {
      client.query(`SELECT * FROM guild_users WHERE guild_id = ${guildId} AND user_id = ${userId}`, (err, results) => {
        if (err) return reject(err);
        
        if(results.rowCount > 0) {
          return resolve(true);
        }

        return resolve(false);
      });
    });
  }  
}