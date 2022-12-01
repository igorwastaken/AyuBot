import type { ArgsOf, Client } from "discordx";
import { Discord, On } from "discordx";
import sql from '../../structures/database'
import { TextChannel } from 'discord.js'
import util from '../../structures/util'

@Discord()
export class Example {
  @On()
  async guildMemberAdd([member]: ArgsOf<"guildMemberAdd">, client: Client): Promise<void> {
    const data = await sql`
     SELECT * FROM guilds
     WHERE id = ${member.guild.id}
    `
    if(!data[0] || !data[0].welcome || !data[0].welcomechannel) return;
    const json = data[0].welcometext;
    const channels = member?.guild.channels.cache.get(data[0].welcomechannel) as TextChannel;
    if(!channels) return;
    try {
     await channels.send(util.welcome(json, member));
    } catch(e) {
      console.log(e);
    }
  }
}