const { client } = require('../../sql/config.js');
const GuildController = require('./Guild');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = class GuildLol {
  guildId;

  constructor(guildId) {
    this.guildId = guildId;
  }

  setChampionRole(champion) {
    return new Promise((resolve, reject) => {
      client.query(`UPDATE guilds SET lol_champion_role = '${champion}' WHERE guild_id = ${this.guildId};`,
      err => {
        if(err) return reject(err);

        return resolve();
      });
    });
  }

  addMaestryRole(points, role) {
    return new Promise((resolve, reject) => {
      client.query(`INSERT INTO lol_maestry_roles (guild_id, points, role) VALUES 
      (${this.guildId}, ${points}, ${role}) ON CONFLICT (guild_id, points) DO UPDATE
      SET role = ${role};`, 
      err => {
        if(err) return reject(err);

        return resolve();
      });
    });
  }

  removeMaestryRole(points) {
    return new Promise((resolve, reject) => {
      client.query(`DELETE FROM lol_maestry_roles WHERE points = ${points} AND guild_id = ${this.guildId};`, 
      err => {
        if(err) return reject(err);
        
        return resolve();
      });
    });
  }

  getRoles() {
    return new Promise((resolve, reject) => {
      client.query(`SELECT * FROM lol_maestry_roles WHERE guild_id = ${this.guildId} ORDER BY points;`,
      (err, results) => {
        if(err) return reject(err);

        return resolve(results.rows);
      });
    });
  }

  // Pegar roles que o usuário consegue pelos seus pontos de maestria.
  getPossibleRoles(points) {
    return new Promise((resolve, reject) => {
      client.query(`SELECT * FROM lol_maestry_roles WHERE guild_id = ${this.guildId} AND ${points} > points ORDER BY points;`,
      (err, results) => {
        if(err) return reject(err);

        return resolve(results.rows);
      });
    });
  }

  async giveRole(region, username, Discord, message, embedMsg) {
    // Pegar champion escolhido pelo servidor.
    let guildController = new GuildController();
    let guildData = await guildController.getGuild(this.guildId);
    let url = `https://championmastery.gg/summoner?summoner=${username}&region=${region}`
    

    fetch(url)
      .then(res => res.text())
      .then(async body => {
        const $ = cheerio.load(body);

        // Verificar se ícone está correto.
        let icon = $('div#header > h1 > img').attr('src');
        
        if(!icon) {
          let embed = new Discord.MessageEmbed()
            .setDescription('Usuário não foi encontrado!')
            .setColor(0xf33434);

          return embedMsg.edit({embed: embed});
        }
        
        icon = icon.split('/')[3].split('.')[0];
        if(icon != '1') {
          let embed = new Discord.MessageEmbed()
            .setDescription('Ícone é diferente do desejado! Usuário não confirmado.')
            .setColor(0xf33434);

          return embedMsg.edit({embed: embed});
        }

        let points = $('tbody#tbody > tr').filter(function(index) {
          let champion = $(this).find('td:first-child > a').text();
          
          return champion.toLowerCase() == guildData.lol_champion_role.toLowerCase();
        }).find('td:nth-child(3)').text();

        // Caso usuário não tenha pontos com o champion ou o champion setado no server não exista.
        if(points == '') {
          let embed = new Discord.MessageEmbed()
            .setDescription(`Você não possui pontos com **${guildData.lol_champion_role}**!`)
            .setColor(0xf33434);

          return embedMsg.edit({embed: embed});
        }

        // Pegar roles que usuário pode conseguir com seus pontos de maestria.
        let maestryRoles = await this.getPossibleRoles(points);
        
        // Remover todas os cargos do usuário, para caso ele já tenha.
        maestryRoles.forEach(maestryRole => {
          let role = message.member.guild.roles.cache.find(role => role.id === maestryRole.role);
          message.member.roles.remove(role);
        });

        // Adicionar o último, ou seja, o maior que ele pode conseguir.
        let role = message.member.guild.roles.cache.find(role => role.id == maestryRoles[maestryRoles.length - 1].role);
        message.member.roles.add(role);

        let embed = new Discord.MessageEmbed()
          .setDescription(`Você possui **${points}** pontos de maestria de **${guildData.lol_champion_role}**! \n Você ganhou a role **${role.name}**!`)
          .setColor(0xf33434);

        return embedMsg.edit({embed: embed});
      });
  }
}