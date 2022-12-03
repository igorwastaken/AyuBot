import {
    ButtonComponent,
    Discord,
    ModalComponent,
    SelectMenuComponent,
    Slash,
    SlashGroup
} from "discordx";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    CommandInteraction,
    EmbedBuilder,
    Guild,
    GuildBasedChannel,
    GuildMember,
    MessageActionRowComponentBuilder,
    PermissionFlagsBits,
    MessageFlags,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    ModalSubmitInteraction,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js'
import {
    ChannelType
} from 'discord.js'
import type {
    Client
} from 'discordx'
import sql from '../../structures/database'
@Discord()
@SlashGroup({
    description: "Change some server settings",
    name: "settings"
})
@SlashGroup("settings")
class SettingsCommand {
    @ButtonComponent({
        id: "welcomeedit"
    })
    async edit(interaction: ButtonInteraction) {
        const guild = interaction?.guild as Guild;
        const data = await sql`

     SELECT * FROM guilds

     WHERE id = ${guild.id}

    `
        if (!data[0]) return await interaction.reply({
            content: "Ocorreu um erro, tente novamente.",
            flags: MessageFlags.Ephemeral
        });
        const modal = new ModalBuilder().setTitle("Editar servidor").setCustomId("editmodal");
        const text = new TextInputBuilder().setCustomId("welcometext").setLabel("Texto de boas-vindas").setPlaceholder("Lembre-se: Tem que ser JSON").setStyle(TextInputStyle.Paragraph).setValue(data[0].welcometext);
        const channels = guild.channels.cache.filter((c: GuildBasedChannel) => (c.type === ChannelType.GuildText)).map(c => {
            return {
                default: c.id === data[0].welcomechannel,
                label: c.name,
                value: c.id
            }
        })
        console.log(channels)
        const select = new StringSelectMenuBuilder().setCustomId("welcomechannel").setPlaceholder("Nothing selected").addOptions(channels);
        const row1 = new ActionRowBuilder < TextInputBuilder > ().addComponents(text);
        modal.addComponents(row1);
        interaction.showModal(modal);
    }
    @ButtonComponent({
        id: "welcometest"
    })
    test(interaction: ButtonInteraction, client: Client): void {
        const member = interaction.member as GuildMember;
        client.emit("guildMemberAdd", member);
        interaction?.reply({
            content: "[💡] Testado!",
            flags: MessageFlags.Ephemeral
        })
    }
    @ModalComponent({
        id: "editmodal"
    })
    async modal(interaction: ModalSubmitInteraction) {
        const guild = interaction?.guild as Guild;
        const [welcometext,
            channel
        ] = ["welcometext", "welcomechannel"].map((id) => interaction.fields.getTextInputValue(id));
        await sql`

     UPDATE guilds SET welcometext = ${welcometext} WHERE id = ${guild.id}

    `
        interaction?.reply({
            content: "[✏️] Configurações alteradas!",
            flags: MessageFlags.Ephemeral
        })
    }
    @ButtonComponent({
        id: "welcomechannel"
    })
    async channel(interaction: ButtonInteraction) {
        const guild = interaction?.guild as Guild;
        const data = await sql`

     SELECT * FROM guilds

     WHERE id = ${guild.id}

    `
        if (!data[0]) return await interaction.reply({
            content: "Ocorreu um erro, tente novamente.",
            flags: MessageFlags.Ephemeral
        });
        const channels = guild.channels.cache.filter((c: GuildBasedChannel) => (c.type === ChannelType.GuildText)).map(c => {
            return {
                default: c.id === data[0].welcomechannel,
                label: c.name,
                value: c.id
            }
        })
        // console.log(channels)
        const menu = new StringSelectMenuBuilder().setCustomId("wchannelmenu").setPlaceholder("Nothing selected").addOptions(channels);
        const selectrow = new ActionRowBuilder < MessageActionRowComponentBuilder > ().addComponents(menu);
        interaction.reply({
            content: `Selecione um canal para dar boas vindas a alguém.`,
            components: [
                selectrow
            ],
            flags: MessageFlags.Ephemeral
        })
    }
    @SelectMenuComponent({
        id: "wchannelmenu"
    })
    async handle(interaction: StringSelectMenuInteraction) {
        const guild = interaction?.guild as Guild;
        const data = await sql`

     SELECT * FROM guilds

     WHERE id = ${guild.id}

    `
        if (!data[0]) return await interaction.reply({
            content: "Ocorreu um erro, tente novamente.",
            flags: MessageFlags.Ephemeral
        });
        await interaction.deferReply();
        const channel = interaction.values?.[0];
        await sql`

     UPDATE guilds SET welcomechannel = ${channel} WHERE id = ${guild.id}

    `
        interaction.reply({
            content: `Canal alterado para: <#${channel}>`,
            flags: MessageFlags.Ephemeral,
            components: []
        })
    }
    @Slash({
        name: "welcome",
        description: "Change welcome server settings",
        defaultMemberPermissions: PermissionFlagsBits.ManageGuild
    })
    async welcome(interaction: CommandInteraction, client: Client) {
        const guild = interaction?.guild as Guild;
        const data = await sql`

     SELECT * FROM guilds

     WHERE id = ${guild.id}

    `
        if (!data[0]) return await interaction.reply({
            content: "Ocorreu um erro, tente novamente.",
            flags: MessageFlags.Ephemeral
        });
        const btn = new ButtonBuilder().setEmoji("✏️").setStyle(ButtonStyle.Primary).setCustomId("welcomeedit");
        const test = new ButtonBuilder().setEmoji("💡").setLabel("Testar").setStyle(ButtonStyle.Primary).setCustomId("welcometest")
        const channel = new ButtonBuilder().setEmoji("✏️").setLabel("Selecionar canal").setStyle(ButtonStyle.Primary).setCustomId("welcomechannel")
        const buttonRow = new ActionRowBuilder < MessageActionRowComponentBuilder > ().addComponents(btn, test, channel);
        const embed = new EmbedBuilder().setTitle("Configurações do servidor").addFields([{
            name: "Boas-vindas",
            value: `${data[0].welcome?"Ativado":"Desativado"}`,
            inline: true
        }, {
            name: "Texto de boas-vindas",
            value: `${data[0].welcometext.toString()??"Parece que não há nenhum texto de boas-vindas"}`,
            inline: true
        }, {
            name: "Canal de boas-vindas",
            value: `<#${data[0].welcomechannel??"0"}>`
        }]);
        await interaction.reply({
            embeds: [embed],
            flags: MessageFlags.Ephemeral,
            components: [
                buttonRow
            ]
        })
    }
}