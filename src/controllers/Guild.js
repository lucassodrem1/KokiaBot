const { client } = require('../../sql/config.js');

module.exports = class Guild {
  addGuild(guildId, prefix) {
    client.query(`INSERT INTO guilds (guild_id, prefix) VALUES (${guildId}, '${prefix}');`,
      err => {
        if (err) throw err;
      }
    );
  }

  getGuild(guildId) {
    return new Promise((resolve, reject) => {
      client.query(`SELECT * FROM guilds WHERE guild_id = ${guildId};`, (err, results) => {
        if(err) return reject(err);

        return resolve(results.rows[0]);       
      }); 
    });
  }

  deleteGuild(guildId) {
    client.query(`DELETE FROM guilds WHERE guild_id = ${guildId}`,
    err => {
      if (err) throw err;
    }
    );
  }

  // Trocar um campo da tabela guilds.
  updateInfo(guildId, updateField, value) {
    return new Promise((resolve, reject) => {
      client.query(`UPDATE guilds SET ${updateField} = '${value}' WHERE guild_id = ${guildId};`, err => {
        if(err) return reject(err);

        return resolve();
      });
    });
  }
  
  addGuildLevelSystem(guildId, config) {
    client.query(`INSERT INTO guild_level_system (guild_id, level_up_message, level_up_channel) VALUES 
    (${guildId}, '${config.system_level.level_up_message}', ${config.system_level.level_up_channel});`,
      err => {
        if (err) throw err;
      }
    );
  }

  getGuildLevelSystem(guildId) {
    return new Promise((resolve, reject) => {
      client.query(`SELECT * FROM guild_level_system WHERE guild_id = ${guildId};`, (err, results) => {
        if(err) return reject(err);

        return resolve(results.rows[0]);       
      }); 
    });
  }

  // Trocar um campo da tabela guild_level_system.
  updateSystemLevel(guildId, updateField, value) {
    return new Promise((resolve, reject) => {
      client.query(`UPDATE guild_level_system SET ${updateField} = '${value}' WHERE guild_id = ${guildId};`, err => {
        if(err) return reject(err);

        return resolve();
      });
    });
  }
}
