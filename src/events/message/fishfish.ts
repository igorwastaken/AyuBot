import type { ArgsOf, Client } from "discordx";
import { Discord, On } from "discordx";
import sql from '../../structures/database'
import { Guild } from 'discord.js'

@Discord()
export class Example {
  @On()
  async messageCreate([message]: ArgsOf<"messageCreate">, client: Client): Promise<void> {
    const guild = message.guild as Guild;
    const data = await sql`
     SELECT * FROM guilds WHERE id = ${guild?.id}
    `
    if(!data[0]) return;
    if(!data[0].antiphishing) return;
    console.log(data[0])
  }
}