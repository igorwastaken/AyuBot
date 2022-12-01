import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { ApplicationCommandOptionType, AttachmentBuilder, CommandInteraction, EmbedBuilder, GuildMember } from 'discord.js'
import type { Client } from 'discordx'
import fetch from 'node-fetch'

@Discord()
class AnimeCommands {
  private static url = "https://some-random-api.ml/animu/";
  @Slash({
    name: "hug",
    description: "Hug someone..."
  })
  async hug(
    @SlashOption({
      name: "member",
      description: "Someone to hug",
      type: ApplicationCommandOptionType.User,
      required: true
    })
    member: GuildMember,
    interaction: CommandInteraction, 
    client: Client
  ): Promise<void> {
    const res = await fetch(AnimeCommands.url + "hug");
    const data = await(res.json()) as any;
    
    let text = `${interaction?.member} abraçou ${member}!`;
    if(member?.id === interaction.user.id) text = `${interaction?.member} se abraçou!`;
    if(member?.id === client.user?.id) text = `${interaction?.member} me abraçou! Obrigada!`;
    
    const embed = new EmbedBuilder()
      .setDescription(text)
      .setImage(data.link);
    interaction?.reply({embeds: [embed]});
  }
  @Slash({
    name: "pat",
    description: "Pat someone..."
  })
  async pat(
    @SlashOption({
      name: "member",
      description: "Someone to pat",
      type: ApplicationCommandOptionType.User,
      required: true
    })
    member: GuildMember,
    interaction: CommandInteraction, 
    client: Client
  ): Promise<void> {
    const res = await fetch(AnimeCommands.url + "pat");
    const data = await(res.json()) as any;
    
    let text = `${interaction?.member} fez carinho ${member}!`;
    // if(member?.id === interaction.user.id) return interaction?.reply({content: "Acho impossível fazer carinho em si mesmo"});
    if(member?.id === client.user?.id) text = `${interaction?.member} fez carinho em mim! Obrigada!`;
    
    const embed = new EmbedBuilder()
      .setDescription(text)
      .setImage(data.link);
    interaction?.reply({embeds: [embed]});
  }
}