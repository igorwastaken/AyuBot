import { Discord, Slash } from "discordx";
import { CommandInteraction } from 'discord.js'
import type { Client } from 'discordx'

@Discord()
export class PingCommand {
  @Slash({
    name: "ping",
    description: "pong."
  })
  async ping(interaction: CommandInteraction, client: Client): Promise<void> {
    interaction?.reply(`pong! \`${client?.ws.ping}ms\``)
  }
}