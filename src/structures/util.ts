import type { GuildMember } from 'discord.js'
export default {
   welcome(text: string, member: GuildMember) {
     const stringjson = text
      .replace(/{#user.mention}/g, `<@!${member.user.id}>`)
       .replace(/{#user.username}/g, `${member.user.username}`)
       .replace(/{#user.tag}/g, `${member.user.tag}`)
       .replace(/{#user.discriminator}/g, `${member.user.discriminator}`)
      .replace(/{#server.name}/g, member.guild.name);
     const json = JSON.parse(stringjson);
     // console.log(json)
     return json;
  }
}