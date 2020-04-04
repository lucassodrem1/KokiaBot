module.exports.variableReplace = function(userData, message, text) {
  text = text.replace('{user}', `${message.author.name}`);
  text = text.replace('{user.tag}', `${message.author.tag}`);
  text = text.replace('{user.ping}', `<@${message.author.id}>`);
  text = text.replace('{level}', `${userData.level + 1}`);

  return text;
}