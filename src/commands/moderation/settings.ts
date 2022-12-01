import { ButtonComponent, Discord, ModalComponent, Slash, SlashGroup } from "discordx";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction, EmbedBuilder, Guild, GuildMember, MessageActionRowComponentBuilder, PermissionsBitField, MessageFlags, ModalBuilder, ModalSubmitInteraction,  TextInputBuilder, TextInputStyle } from 'discord.js'

import type { Client } from 'discordx'
import sql from '../../structures/database'

@Discord()
@SlashGroup({description: "Change some server settings", name: "settings"})
@SlashGroup("settings")
class SettingsCommand {
  @ButtonComponent({ id: "welcomeedit" })
  async edit(interaction: ButtonInteraction) {
    const guild = interaction?.guild as Guild;
    const data = await sql`
     SELECT * FROM guilds
     WHERE id = ${guild.id}
    `
    if(!data[0]) return await interaction.reply({ content: "Ocorreu um erro, tente novamente.", flags: MessageFlags.Ephemeral});
    const modal = new ModalBuilder()
      .setTitle("Editar servidor")
      .setCustomId("editmodal");

    const text = new TextInputBuilder()
      .setCustomId("welcometext")
      .setLabel("Texto de boas-vindas")
      .setPlaceholder("Lembre-se: Tem que ser JSON")
      .setStyle(TextInputStyle.Paragraph)
      .setValue(data[0].welcometext);
    const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(
      text
    );
    modal.addComponents(row1);
    interaction.showModal(modal);
  }
  @ButtonComponent({ id: "welcometest" })
  test(interaction: ButtonInteraction, client: Client): void {
    const member = interaction.member as GuildMember;
    client.emit("guildMemberAdd", member);
    interaction?.reply({content: "[💡] Testado!", flags: MessageFlags.Ephemeral})
  }
  @ModalComponent({id: "editmodal"})
  async modal(interaction: ModalSubmitInteraction) {
    const guild = interaction?.guild as Guild;
    const [welcometext] = ["welcometext"].map((id) =>
      interaction.fields.getTextInputValue(id)
    );
    await sql`
     UPDATE guilds SET welcometext = ${welcometext} WHERE id = ${guild.id}
    `
    interaction?.reply({content: "[✏️] Configurações alteradas!", flags: MessageFlags.Ephemeral})
  }
  @Slash({
    name: "welcome",
    description: "Change welcome server settings"
  })
  async welcome(interaction: CommandInteraction, client: Client) {
    const guild = interaction?.guild as Guild;
    const data = await sql`
     SELECT * FROM guilds
     WHERE id = ${guild.id}
    `
    if(!data[0]) return await interaction.reply({ content: "Ocorreu um erro, tente novamente.", flags: MessageFlags.Ephemeral});

    const btn = new ButtonBuilder()
      .setEmoji("✏️")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("welcomeedit");
    const test = new ButtonBuilder()
      .setEmoji("💡")
      .setLabel("Testar")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("welcometest")
    const buttonRow =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        btn, test
      );

    
    const embed = new EmbedBuilder()
      .setTitle("Configurações do servidor")
      .addFields([
        {
          name: "Boas-vindas",
          value: `${data[0].welcome?"Ativado":"Desativado"}`,
          inline: true
        },
        {
          name: "Texto de boas-vindas",
          value: `${data[0].welcometext.toString()??"Parece que não há nenhum texto de boas-vindas"}`,
          inline: true
        }
      ]);
      await interaction.reply({embeds: [embed], flags: MessageFlags.Ephemeral, components: [buttonRow]})
  }
}