import { Discord, MetadataStorage, Slash } from "discordx";
import { CommandInteraction } from 'discord.js'

@Discord()
export class PingCommand {
  @Slash({
    name: "ping",
    description: "pong."
  })
  async ping(interaction: CommandInteraction): Promise<void> {
    interaction?.reply("pong!")
  }
}