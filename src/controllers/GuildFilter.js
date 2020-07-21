const Discord = require("discord.js");
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

  addIgnoreChannel(channelId) {
    return new Promise((resolve, reject) => {
      client.query(`INSERT INTO guild_filter_ignore_channels (guild_id, channel_id) VALUES (${this.guildId}, ${channelId});`, 
      err => {
        if(err) return reject(err);

        return resolve();
      });
    });
  }

  deleteIgnoreChannel(channelId) {
    return new Promise((resolve, reject) => {
      client.query(`DELETE FROM guild_filter_ignore_channels WHERE guild_id = ${this.guildId} AND channel_id = ${channelId};`, 
      (err, results) => {
        if(err) return reject(err);

        return resolve(results.rowCount);
      });
    });
  }

  getIgnoreChannelsByGuildId() {
    return new Promise((resolve, reject) => {
      client.query(`SELECT channel_id FROM guild_filter_ignore_channels WHERE guild_id = ${this.guildId};`, (err, results) => {
        if(err) return reject(err);

        return resolve(results.rows);
      }); 
    });
  }

  // Filtros de palavras.

  getBlockedTerm() {
    return new Promise((resolve, reject) => {
      client.query(`SELECT number, term, weight FROM guild_blocked_terms 
      WHERE guild_id = ${this.guildId} ORDER BY number;`, (err, results) => {
        if(err) return reject(err);

        return resolve(results.rows);
      });
    });
  }

  addBlockedTerm(message, number, term, weight) {
    return new Promise((resolve, reject) => {
      client.query(`INSERT INTO guild_blocked_terms (guild_id, number, term, weight) 
      VALUES (${this.guildId}, ${number}, '${term}', ${weight});`, 
      err => {
        if(err) {
          if(err.code == 23505) return message.channel.send('Este termo já está na lista de termos bloqueados!');
          return reject(err);
        }

        return resolve();
      });
    });
  }

  removeBlockedTerm(message, number) {
    return new Promise((resolve, reject) => {
      client.query(`DELETE FROM guild_blocked_terms WHERE guild_id = ${this.guildId}
      AND number = ${number};`, (err, results) => {
        if(err) return reject(err);

        if(!results.rowCount) return message.channel.send('Nenhum número encontrado.')
        return resolve();
      });
    });
  }

  removeAllBlockedTerms(message) {
    return new Promise((resolve, reject) => {
      client.query(`DELETE FROM guild_blocked_terms WHERE guild_id = ${this.guildId};`, 
      (err, results) => {
        if(err) return reject(err);

        if(!results.rowCount) return message.channel.send('Nenhum termo encontrado.')
        return resolve();
      });
    });
  }

  checkMessageTerms(message, blockedTerms) {
    let messageWords = message.content.toLowerCase().trim();
    let hasBlockedTerms;

    return new Promise(resolve => {
      blockedTerms.find(terms => {
        if(messageWords.includes(terms.term.toLowerCase())) {
          return hasBlockedTerms = terms;
        } 
      });

      return resolve(hasBlockedTerms);
    })
  }

  addPenaltyPoints(userId, points) {
    return new Promise((resolve, reject) => {
      client.query(`INSERT INTO guild_penalty_users (guild_id, user_id, penalty_points) 
      VALUES (${this.guildId}, ${userId}, ${points}) ON CONFLICT (guild_id, user_id)
      DO UPDATE SET penalty_points = guild_penalty_users.penalty_points + ${points};`, err => {
        if(err) return reject(err);

        return resolve();
      });
    });
  }

  getPenaltyPointsByUser(userId) {
    return new Promise((resolve, reject) => {
      client.query(`SELECT user_id, penalty_points FROM guild_penalty_users WHERE guild_id = ${this.guildId}
      AND user_id = ${userId};`, (err, results) => {
        if(err) return reject(err);

        return resolve(results.rows[0]);
      });
    });
  }

  // Criar mensagem de log.
  sendPenaltyLog(message, logChannel, userPoints, type = 0) {
    let messageDetails = {
      0: {title: 'Penalização', reason: 'Mensagem apresenta uma palavra bloqueada.', color: '0x4196f7'},
      1: {title: 'Mutado | 2h', reason: 'Usuário atingiu o limite de pontos permitidos.', color: '0xfac10c'}
    };
    let channel = message.guild.channels.cache.find(channel => channel.id == logChannel);

    let embed = new Discord.MessageEmbed()
      .setTitle(messageDetails[type].title)
      .setThumbnail(message.author.displayAvatarURL())
      .setColor(messageDetails[type].color)
      .addField('Usuário', `<@${message.author.id}>`, true)
      .addField('Pontos', userPoints, true)
      .addField('Motivo', messageDetails[type].reason, false)
      .setTimestamp();

    channel.send({embed: embed, split: true});
  }

   // Criar mensagem de moderação de log.
   sendModPenaltyLog(message, target, logChannel, title, reason, color = '0x33cc33') {
    let channel = message.guild.channels.cache.find(channel => channel.id == logChannel);

    let embed = new Discord.MessageEmbed()
      .setTitle(title)
      .setThumbnail(message.author.displayAvatarURL())
      .setColor(color)
      .addField('Usuário', `${target}`, true)
      .addField('Moderador', `<@${message.author.id}>`, true)
      .addField('Motivo', reason, false)
      .setTimestamp();

    channel.send({embed: embed, split: true});
  }

  // Verificar se usuário passou do limite de pontos, 
  // deletar da lista de penalidades, ser mutado e adicionar no db.
  async checkIfisToMute(message, guildFilter, user) {
    if(user.penalty_points >= guildFilter.points_to_mute) {
      this.createMutedRole(message);
      this.deleteUserPenaltyPoints(user.user_id);
      
      // Calcular quando será liberado.
      let whenUnmute = Date.now() + 2 * 60 * 60 * 1000;  
      this.addMutedUser(user.user_id, whenUnmute)

      if(guildFilter.log_channel != 0) {
        this.sendPenaltyLog(message, guildFilter.log_channel, user.penalty_points, 1);
      }
    }
  }

  // Verificar se role já está criada
  // se não estiver, criar.
  // Por permissões e dar ao usuário.
  async createMutedRole(message) {
    // Verificar se já existe a role.
    let muteRole = message.guild.roles.cache.find(role => role.name == 'Muted');
    if(!muteRole) {
      // Criar role.
      muteRole = await message.guild.roles.create({
        data: {
          name: 'Muted',
          permissions: []
        }
      });
    }

    // Setar permissões de role.
    message.guild.channels.cache.forEach(async channel => {
      await channel.createOverwrite(muteRole, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false
      });
    });
    
    // Dar role ao usuário.
    await message.member.roles.add(muteRole);
  }

  // Deletar pontos de penalidade do usuário.
  deleteUserPenaltyPoints(userId) {
    client.query(`DELETE FROM guild_penalty_users WHERE guild_id = ${this.guildId} AND user_id = ${userId};`, 
    err => {
      if(err) throw err;
    });
  }

  // Deletar pontos de penalidade de todos os usuários do server.
  deleteAllUsers() {
    client.query(`DELETE FROM guild_penalty_users WHERE guild_id = ${this.guildId};`, 
    err => {
      if(err) throw err;
    });
  }

  addMutedUser(userId, whenUnmute) {
    client.query(`INSERT INTO guild_muted_users (guild_id, user_id, when_unmute) 
      VALUES (${this.guildId}, ${userId}, ${whenUnmute}) ON CONFLICT (guild_id, user_id)
      DO UPDATE SET when_unmute = ${whenUnmute};`, err => {
      if(err) throw err;
    });
  }

  addMutedUser(userId, whenUnmute) {
    client.query(`INSERT INTO guild_muted_users (guild_id, user_id, when_unmute) 
      VALUES (${this.guildId}, ${userId}, ${whenUnmute}) ON CONFLICT (guild_id, user_id)
      DO UPDATE SET when_unmute = ${whenUnmute};`, err => {
      if(err) throw err;
    });
  }

  static deleteMutedUser(guildId, userId) {
    client.query(`DELETE FROM guild_muted_users WHERE guild_id = ${guildId}
      AND user_id = ${userId};`, err => {
      if(err) throw err;
    });
  }

  static getAllMutedUsers() {
    return new Promise((resolve, reject) => {
      client.query(`SELECT * FROM guild_muted_users;`, 
      (err, results) => {
        if(err) return reject(err);

        return resolve(results.rows);
      });
    });
  }

  static async checkToUnmuteUsers(guilds) {
    let now = Date.now();
    let mutedUsers = await this.getAllMutedUsers();
    mutedUsers.forEach(mutedUser => {
      // Se horário atual for maior que horario de desmute,
      // desmutar o usuário.
      if(now >= mutedUser.when_unmute) {
        // Identificar guild do usuário.
        let guild = guilds.find(guild => guild.id == mutedUser.guild_id);
        if(!guild) return;

        // Remover usuário do banco de dados.
        this.deleteMutedUser(guild.id, mutedUser.user_id);

        // Pegar usuário na guilda.
        let member = guild.members.fetch(mutedUser.user_id)
        .then(member => {
          if(!member) return;

            // Remover role.
            let muteRole = member.roles.cache.find(role => role.name === 'Muted');
            if(!muteRole) return;
            member.roles.remove(muteRole);
          })
          .catch(e => {return;});
      }
    });
  }
}