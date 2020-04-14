const { client } = require('../../sql/config.js');
const GuildController = require('./Guild');
const { variableReplace } = require('../utils/variableReplace');

module.exports = class User {
  addUser(guildId, userId) {
    return new Promise((resolve, reject) => {
      client.query(`INSERT INTO guild_users (guild_id, user_id) VALUES (${guildId}, ${userId});`, err => {
        if (err) return reject(err);

        return resolve();
      });
    });
  }

  deleteUser(guildId, userId) {
    client.query(`DELETE FROM guild_users WHERE guild_id = ${guildId} AND user_id = ${userId}`,
      err => {
        if (err) throw err;
      }
    );
  }
  
  // Pegar informações de um usuário.
  getUserInfo(userId, message) {
    return new Promise((resolve, reject) => {
      client.query(`SELECT * FROM guild_users WHERE guild_id = ${message.guild.id} AND user_id = ${userId}`, (err, results) => {
        if(err) return reject(err);

        if(!results.rows[0]) return message.channel.send('Usuário não encontrado!'); 

        let userData = results.rows[0];
        
        userData.nextXpLevel = 5 * (Math.pow(userData.level, 2)) + 50 * userData.level + 100;

        return resolve(userData);
      });
    });
  }

  // Pegar rank de users do server por ordem de level.
  getUsersRank(guildId, limit = 0) {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM guild_users WHERE guild_id = ${guildId} ORDER BY total_xp DESC;`;

      if (limit) {
        query = `SELECT * FROM guild_users WHERE guild_id = ${guildId} ORDER BY total_xp DESC LIMIT ${limit};`;
      } 

      client.query(query, (err, results) => {
        if(err) return reject(err);
       
        results.rows.map(data => {
          data.nextXpLevel = 5 * (Math.pow(data.level, 2)) + 50 * data.level + 100;
        });

        return resolve(results.rows);       
      }); 
    });
  }
  
  checkIfUserExists(guildId, userId) {
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

  // Dar 15 a 25 de xp para o usuário caso ele não esteja no tempo de cooldown.
  async earnXp(userId, message) {
    // Gerar xp.
    let xpEarnValue = Math.floor(Math.random() * 11) + 15;

    client.query(`UPDATE guild_users SET current_xp_level = current_xp_level + ${xpEarnValue}, total_xp = total_xp + ${xpEarnValue}
    WHERE guild_id = ${message.guild.id} AND user_id = ${userId};`, async err => {
      if(err) throw err;
      
      try {
        // Pegar informações do usuário.
        let userData = await this.getUserInfo(userId, message);

        // Verificar se o user pode subir de level.
        if(userData.current_xp_level >= userData.nextXpLevel) {
          let overXp = userData.current_xp_level - userData.nextXpLevel;
          await this.levelUp(message.guild.id, userId, overXp);

          let guildController = new GuildController();
          // Pegar informações da guild level system.
          let guildData = await guildController.getGuildLevelSystem(message.guild.id);

          let levelUpMessage = variableReplace(userData, message, guildData.level_up_message);

          let guildCustomLevels = await guildController.getCustomLevels(message.guild.id);
          // Verificar se há um level custom para o level alcançado.
          let customLevel = guildCustomLevels.find(customLevel => customLevel.level === userData.level + 1);
          if(customLevel) {
            let customLevelRole = message.member.guild.roles.cache.find(role => role.id === customLevel.role);
            
            // Trocando mensagem para a do level custom se ela existir.
            if(customLevel.message) {
              levelUpMessage = variableReplace(userData, message, customLevel.message, customLevelRole.name);
            }

            // Dando cargo do level custom.
            message.member.roles.add(customLevelRole);

            let guildInfo = await guildController.getGuild(message.guild.id);
            // Verificar se é para dar replace nos cargos dados pelo custom levels.
            if(guildInfo.custom_role_replace) {
              guildCustomLevels.forEach(actualCustomLevel => {
                if(actualCustomLevel.level < customLevel.level) {
                  let role = message.member.guild.roles.cache.find(role => role.id === actualCustomLevel.role);
                  message.member.roles.remove(role);
                }
              });
            }
          }

          // Verificar canal para mandar mensagem de level up.
          if(guildData.level_up_channel != 0) {
            let channelMessage = message.member.guild.channels.cache.find(channel => channel.id == guildData.level_up_channel);
            if(channelMessage) return channelMessage.send(levelUpMessage);
          }
          
          message.channel.send(levelUpMessage);
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  // Upar level do usuário.
  levelUp(guildId, userId, overXp) {
    return new Promise((resolve, reject) => {
      client.query(`UPDATE guild_users SET current_xp_level = ${overXp}, level = level + 1
      WHERE guild_id = ${guildId} AND user_id = ${userId};`, err => {
        if(err) return reject(err);
  
        return resolve();
      });
    });
  }
}