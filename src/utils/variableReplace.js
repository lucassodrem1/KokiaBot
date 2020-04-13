module.exports.variableReplace = function(userData, message, text, role = null) {
  text = text.replace('{user}', `${message.member.displayName}`);
  text = text.replace('{user.tag}', `${message.author.tag}`);
  text = text.replace('{user.ping}', `<@${message.author.id}>`);
  text = text.replace('{level}', `${userData.level + 1}`);
  text = text.replace('{role}', `${role}`);
  
  return text;
}