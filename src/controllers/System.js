const { client } = require('../../sql/config.js');

module.exports = class GuildLol {
  static updateSystemAdsShown(data) {
    return new Promise((resolve, reject) => {
      client.query(`UPDATE system SET ads_shown = ads_shown + 1 WHERE bot_id = 695267877892259890 RETURNING ads_shown;`, 
      (err, results) => {
        if(err) return reject(err);

        return resolve(results.rows[0].ads_shown);
      });
    });
  }
}