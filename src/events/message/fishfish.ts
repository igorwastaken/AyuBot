import type { ArgsOf, Client } from "discordx";
import { Discord, On } from "discordx";
import sql from '../../structures/database'
import { Guild } from 'discord.js'

@Discord()
export class Example {
  @On()
  messageCreate([message]: ArgsOf<"messageCreate">, client: Client): void {
    const guild = message.guild as Guild;
    const data = sql`
     SELECT * FROM guilds WHERE id = ${guild?.id}
    `
    if(!data[0]) return;
    
  }
}