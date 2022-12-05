import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { CommandInteraction } from 'discord.js'
import type { Client } from 'discordx'
import { ApplicationCommandOptionType } from "discord.js";
import type { GuildMember, User } from 'discord.js'
import { EmbedBuilder } from "discord.js";
import { Pagination } from "@discordx/pagination";


function badges(member: any) {
  const badges = [];
  const badge = member?.user.flags.toArray()
  if(member.user.bot) badges.push("<:application:1045500026551537815>");
  if(member.user.system) badges.push("👨‍💻");
  badge.forEach((b:any) => {
    console.log(b)
    if(b === "BotHTTPInteractions") badges.push("<:global:1045127068851109908>");
    if(b === "VerifiedBot") badges.push("<:verifiedbot:1045499509851050025><:verifiedbot2:1045499565152936076>");
    if(b === "ActiveDeveloper") badges.push("<:activeDeveloper:1044061996536049664>");
    if(b === "HypeSquadOnlineHouse1") badges.push("<:bravery:1044347767629295676>");
    if(b === "HypeSquadOnlineHouse2") badges.push("<:brillance:1044347892997046514>");
    if(b === "HypeSquadOnlineHouse3") badges.push("<:balance:1044347811908550716>");
  })
  return badges.join(" ");
}

function epoch(time: any, type: string) {
  return `<t:${Math.floor(time/1000)}:${type}>`;
}


@Discord()
@SlashGroup({ description: 'Informações', name: "info" })
@SlashGroup("info")
class infoCommand {
     @Slash({ name: "user", description: "Pegar informações de usuário" })
     async user(
       @SlashOption({
         description: "Selecione um Usuário",
         name: "user",
         required: true,
         type: ApplicationCommandOptionType.User,
       })
       member: GuildMember,
       interaction: CommandInteraction) {
       // console.log(member)
       await interaction.deferReply();
       if(!member) return interaction?.deleteReply();
       const embed = new EmbedBuilder()
       .setTitle("Informação de usuário")
       .setDescription(`${badges(member)}`)
       .setThumbnail(member?.user.displayAvatarURL({ size:4096 }))
       .addFields([
        {
          name: "🔖 • Tag",
          value: `${member?.user.tag ?? "Unknown"} ${member?.nickname ? `\`Vulgo ${member?.nickname}\``:""}`,
          inline: true
        },
        {
          name: "🗓️ • Entrou no Discord",
          value: `${epoch(member.user.createdTimestamp, "F")} (<t:${Math.floor(member.user.createdTimestamp/1000)}:R>)`,
          inline: true
        },
        {
          name: "💻 • ID do Discord",
          value: `\`${member.id}\``,
          inline: true
        }
       ])
        .setColor(0x019701);

       await interaction?.editReply({embeds: [embed]})
     }

     @Slash({ name: "server", description: "Pegar informações de servidor" })
     async server(interaction: CommandInteraction) {
       await interaction.deferReply();
       const guild = interaction.guild;
       console.log(guild)
       const bots = guild?.members.cache.filter((u:any) => u?.user.bot).size;
       const members = guild?.members.cache.filter((u:any) => !u?.user.bot).size;
       const embed = new EmbedBuilder()
       .setTitle("Informações do servidor")
       .addFields([
         {
           name: "🏷️ • Nome",
           value: `\`${guild?.name}\``,
           inline: true
         },
         {
           name: "💻 • ID do servidor",
           value: `\`${guild?.id}\``,
           inline: true
         },
         {
           name: "👥 • Quantidade de membros",
           value: `Bots: \`${bots}\`\nMembros:\`${members}\`\nTotal: \`${guild?.memberCount}\``,
           inline: true
         },
         {
           name: "👑 • Dono",
           value: `<@${guild?.ownerId}>`,
           inline: true
         }, 
         {
           name: "🗓️ • Criado em",
           value: `${epoch(guild?.createdTimestamp, "F")} (${epoch(guild?.createdTimestamp, "R")})`,
           inline: true
         }
       ]);
       
       interaction?.editReply({embeds: [embed]})
     }
}