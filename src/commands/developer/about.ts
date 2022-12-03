import { Discord, Slash } from "discordx";
import { CommandInteraction, EmbedBuilder} from 'discord.js'
import type { Client } from 'discordx'

import { Pagination } from "@discordx/pagination";
import util from '../../structures/commandsUtil/about.json'

@Discord()
export class AboutCommand {
  @Slash({
    name: "about",
    description: "About Ayu, see informations about the bot."
  })
  async about(interaction: CommandInteraction, client: Client): Promise<void> {
    const pages = util.map((embed) => {
      const _ = JSON.stringify(embed.embeds[0])
        .replace(/{#bot.guilds}/g, client.guilds.cache.size.toString())
        .replace(/{#bot.users}/g, client.users.cache.size.toString());
      const embeds = JSON.parse(_);
      const e = new EmbedBuilder(embeds)
       .setColor(0x900400);
      return { embeds: [e] };
    })

    const pagination = new Pagination(interaction, pages);
    await pagination.send();
  }
}