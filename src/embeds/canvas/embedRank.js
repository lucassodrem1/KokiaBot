const { embedRank } = require('../embedRank');
const { registerFont, createCanvas, loadImage, Image } = require('canvas');
const fs = require('fs');

registerFont('./assets/fonts/Lato-Regular.ttf', { family: "Lato"});
registerFont('./assets/fonts/Lato-Bold.ttf', { family: "Lato-Bold"});
registerFont('./assets/fonts/Lato-BoldItalic.ttf', { family: "Lato-Italic"});

module.exports.embedCanvasRank = async function(Discord, message, user) {
  const canvas = createCanvas(565, 133);
  let ctx = canvas.getContext('2d');
  const backgroundLink = 'https://cdn.discordapp.com/attachments/709985239535058995/713223480266719292/background.PNG';
  try {
    // Pegar imagem background.
    let backgroundPromise = loadImage(backgroundLink).catch(e => { throw Error('Erro ao carregar background:', e); });
    
    // Convertendo avatar para .png
    let avatarLink = message.author.displayAvatarURL().split('.');
    avatarLink[avatarLink.length - 1] = 'png';
    avatarLink = avatarLink.join('.');

    // Pegar imagem do avatar
    let avatarImagePromise = loadImage(avatarLink).catch(e => { throw Error('Erro ao carregar avatar:', e); });

    const [background, avatarImage] = await Promise.all([backgroundPromise, avatarImagePromise]);

    // Desenhar background
    ctx.drawImage(background, 0, 0);

    ctx.beginPath();
    ctx.fillStyle = '#3a4645';
    ctx.arc(69, 68, 50.2, 0, 2 * Math.PI);
    ctx.fill();
    
    //Barra de xp
    ctx.beginPath();
    ctx.fillStyle = '#47e36d';
    let xpToUp = user.current_xp_level / user.nextXpLevel;
    ctx.arc(69, 68, 50.2, 0, (xpToUp) * (2 * Math.PI));
    ctx.fill();

    // Desenhar avatar
    ctx.save();
    ctx.beginPath();
    ctx.arc(68.8, 68.2, 41, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    
    ctx.drawImage(avatarImage, 27.8, 27.2, 82, 82);

    ctx.beginPath();
    ctx.arc(27.8, 27.2, 41, 0, Math.PI * 2, true);
    ctx.clip();
    ctx.closePath();
    ctx.restore();

    // // Desenhar textos
    ctx.beginPath();
    let fontSize = 30 - (Math.floor(message.member.displayName.length / 10) * 3.6);
    ctx.font = fontSize+'px Lato-Bold';
    ctx.fillStyle = '#e95378';
    ctx.fillText(message.member.displayName, 122, 77);
    
    ctx.beginPath();
    ctx.font = '23px Lato';
    ctx.fillStyle = 'white';
    ctx.fillText(user.level, 485, 44);

    ctx.beginPath()
    ctx.font = '48px Sans';
    ctx.fillStyle = '#e95378';
    // Pegar largura do ranking para se adaptar conforme o número.
    let rankWidth = ctx.measureText('#'+user.ranking).width;
    ctx.fillText('#'+user.ranking, 535 - rankWidth, 120);

    // Números do XP
    let xpInfo = `${user.current_xp_level} / ${user.nextXpLevel}`;
    let xpFontSize = 35 - (Math.floor(xpInfo.length / 2) * 2.5);
    ctx.font = xpFontSize+'px Lato-Italic';
    ctx.fillStyle = 'white';
    ctx.textAlign = "center";
    ctx.fillText(xpInfo, 176, 111);
    
    // Barras de XP.
    // Máximo de xp até 80%.
    // let xpToUp = (475 / user.nextXpLevel) > 1 ? 1 : 475 / user.nextXpLevel;
    // let startX = 115;
    // let startY = 86;
    
    // let secondLineX = (xpToUp * 236) < startX ? ((xpToUp * 236) + startX) : (xpToUp * 236);
    // let secondLineY = ((xpToUp * 118) + startY) < 118 ? ((xpToUp * 118) + startY) : 118;
    // let thirdLineX = (xpToUp * 276.8) < startX ? ((xpToUp * 276.8) + startX) : (xpToUp * 276.8);
    
    // ctx.fillStyle = '#ff2809';
    // ctx.beginPath();
    // ctx.moveTo(startX, startY);
    // ctx.lineTo(73, 118); 
    // ctx.lineTo(secondLineX, secondLineY); // x e y desse vão aumentando.
    // ctx.lineTo(thirdLineX, 86); // x desse vai aumentando.
    // ctx.closePath();
    // ctx.fill();

    // Início da montagem do arquivo.
    let buffer = canvas.toBuffer('image/png');
    
    // Criando arquivo.
    fs.writeFile(`./assets/temp/rank${message.author.id}.png`, buffer, err => {
      if(err) throw err;
      
      // Mandando arquivo.
      message.channel.send({files: [`./assets/temp/rank${message.author.id}.png`]})
      .then(() => {
        // Deletando arquivo.
        fs.unlink(`./assets/temp/rank${message.author.id}.png`, err => {
          if(err) {
            console.error('Erro ao apagar arquivo: ', err);
            embedRank(Discord, message, user);
          };
        });
      })
      .catch(err => {
        //TODO Ao dar erro, exibir embed padrão de rank.
        embedRank(Discord, message, user);
        console.error('Erro ao mandar mensagem: ', err);
      });
    });
  } catch(e) {
    //TODO Ao dar erro, exibir embed padrão de rank.
    embedRank(Discord, message, user);
    console.error(e);
  }
}