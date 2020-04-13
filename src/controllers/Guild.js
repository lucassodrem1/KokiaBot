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
    });
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

  // Adicionar levels customizados do servidor.
  addCustomLevels(guildId, level, role, lvlMessage) {
    return new Promise((resolve, reject) => {
      client.query(`INSERT INTO guild_custom_levels (guild_id, level, role, message) VALUES 
      (${guildId}, ${level}, ${role}, '${lvlMessage}') ON CONFLICT (guild_id, level) DO UPDATE
      SET role = ${role}, message = '${lvlMessage}';`, 
      err => {
        if(err) return reject(err);

        return resolve();
      });
    });
  }

  // Pegar levels customizados do servidor.
  getCustomLevels(guildId) {
    return new Promise((resolve, reject) => {
      client.query(`SELECT * FROM guild_custom_levels WHERE guild_id = ${guildId};`, (err, results) => {
        if(err) return reject(err);

        return resolve(results.rows);
      });
    });
  }

  // Deletar level customizado do servidor por level passado.
  deleteCustomLevelsByLevel(guildId, level) {
    return new Promise((resolve, reject) => {
      client.query(`DELETE FROM guild_custom_levels WHERE guild_id = ${guildId} AND level = ${level};`, (err, results) => {
        if(err) return reject(err);

        return resolve(results.rowCount);
      });
    });
  }

  // Deletar todos os levels customizados do servidor.
  deleteCustomLevels(guildId) {
    return new Promise((resolve, reject) => {
      client.query(`DELETE FROM guild_custom_levels WHERE guild_id = ${guildId};`, err => {
        if(err) return reject(err);

        return resolve();
      });
    });
  }

  // Adicionar informações padrões na tabela guild_welcome.
  addGuildWelcome(guildId, config) {
    client.query(`INSERT INTO guild_welcome (guild_id, image, title, description, footer) VALUES 
    (${guildId}, '${config.welcome.image}', '${config.welcome.title}', '${config.welcome.description}', '${config.welcome.footer}');`, 
    err => {
      if(err) throw err;
    });
  }

  getGuildWelcome(guildId) {
    return new Promise((resolve, reject) => {
      client.query(`SELECT * FROM guild_welcome WHERE guild_id = ${guildId};`, (err, results) => {
        if(err) return reject(err);

        return resolve(results.rows[0]);       
      }); 
    });
  }

  // Mudar alguma informação da tabela guild_welcome.
  updateWelcome(guildId, updateField, value) {
    return new Promise((resolve, reject) => {
      client.query(`UPDATE guild_welcome SET ${updateField} = '${value}' WHERE guild_id = ${guildId};`, err => {
        if(err) return reject(err);

        return resolve();
      });
    });
  }

  addWelcomeImage(guildId, number, image) {
    return new Promise((resolve, reject) => {
      client.query(`INSERT INTO guild_welcome_images (guild_id, number, image) VALUES 
      (${guildId}, ${number}, '${image}') ON CONFLICT (guild_id, number) DO
      UPDATE SET image = '${image}';`, err => {
        if(err) return reject(err);

        return resolve();
      });
    });
  }

  deleteWelcomeImage(guildId, number) {
    return new Promise((resolve, reject) => {
      client.query(`DELETE FROM guild_welcome_images 
      WHERE guild_id = ${guildId} AND number = ${number};`, (err, results) => {
        if(err) return reject(err);

        return resolve(results.rowCount);
      });
    });
  }

  deleteAllWelcomeImages(guildId) {
    return new Promise((resolve, reject) => {
      client.query(`DELETE FROM guild_welcome_images WHERE guild_id = ${guildId};`, (err, results) => {
        if(err) return reject(err);

        return resolve(results.rowCount);
      });
    });
  }

  getWelcomeImages(guildId) {
    return new Promise((resolve, reject) => {
      client.query(`SELECT number, image FROM guild_welcome_images WHERE guild_id = ${guildId};`, (err, results) => {
        if(err) return reject(err);

        return resolve(results.rows);       
      }); 
    });
  }

  getWelcomeImageByNumber(guildId, number) {
    return new Promise((resolve, reject) => {
      client.query(`SELECT image FROM guild_welcome_images WHERE guild_id = ${guildId} AND number = ${number};`, 
      (err, results) => {
        if(err) return reject(err);

        return resolve(results.rows[0]);       
      }); 
    });
  }
}
