module.exports.welcomeReplace = function(member, text) {
  text = text.replace('{user}', `${member.displayName}`);
  text = text.replace('{user.tag}', `${member.user.tag}`);
  text = text.replace('{user.ping}', `<@${member.user.id}>`);
  text = text.replace('{server.name}', `${member.guild.name}`);
  text = text.replace('{server.members}', `${member.guild.memberCount}`);

  return text;
}