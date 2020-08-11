const { client } = require('../../sql/config.js');

module.exports = class GuildLol {
  userId;

  constructor(userId) {
    this.userId = userId;
  }

  static addAccount(data, updateField, value) {
    return new Promise((resolve, reject) => {
      client.query(`INSERT INTO lol_users (user_id, nick, elo, role, description, main, like_main) 
      VALUES (${data.userId}, '${data.nick}', '${data.elo}', '${data.role}', '${data.description}', '${data.main}', '${data.like_main}')
      ON CONFLICT (user_id) DO UPDATE SET ${updateField} = '${value}';`,
      err => {
        if(err) return reject(err);

        return resolve();
      })
    })
  }

  static searchAccount(data) {
    if(data.elo === 'qualquer') data.elo = '%';
    if(data.role === 'qualquer') data.role = '%';
    if(data.main === 'qualquer') data.main = '%';

    return new Promise((resolve, reject) => {
      client.query(`SELECT * FROM lol_users WHERE elo LIKE '${data.elo}' AND role LIKE '${data.role}'
      AND main LIKE '${data.main}' AND user_id != ${data.userId};`,
      (err, results) => {
        if(err) return reject(err);

        let random = Math.floor(Math.random() * results.rows.length);

        return resolve(results.rows[random]);
      })
    })
  }

  static searchAccountOnServer(data) {
    if(data.elo === 'qualquer') data.elo = '%';
    if(data.role === 'qualquer') data.role = '%';
    if(data.main === 'qualquer') data.main = '%';

    return new Promise((resolve, reject) => {
      client.query(`SELECT * FROM lol_users WHERE elo LIKE '${data.elo}' AND role LIKE '${data.role}'
      AND main LIKE '${data.main}' AND user_id != ${data.userId};`,
      (err, results) => {
        if(err) return reject(err);

        // Embaralhar array.
        this.shuffleArray(results.rows);
        
        // Pegar o primeiro que for do mesmo servidor.
        results.rows.forEach(user => {
          let isOnServer = data.guild.member(user.user_id);
          
          if(isOnServer) return resolve(user);
        })

        return resolve();
      })
    })
  }

  static searchAccountByLikeMain(data) {
    return new Promise((resolve, reject) => {
      client.query(`SELECT * FROM lol_users WHERE like_main = '${data.main}' AND user_id != ${data.userId};`,
      (err, results) => {
        if(err) return reject(err);

        let random = Math.floor(Math.random() * results.rows.length);

        return resolve(results.rows[random]);
      })
    })
  }

  getAccountByUserId() {
    return new Promise((resolve, reject) => {
      client.query(`SELECT * FROM lol_users WHERE user_id = ${this.userId};`,
      (err, results) => {
        if(err) return reject(err);

        return resolve(results.rows[0]);
      });
    })
  }

  deleteAccountByUserId() {
    return new Promise((resolve, reject) => {
      client.query(`DELETE FROM lol_users WHERE user_id = ${this.userId};`,
      (err, results) => {
        if(err) return reject(err);
        
        resolve(results.rowCount);
      })
    })
  }

  static shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  } 
}

