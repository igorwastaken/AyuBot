import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { CommandInteraction } from 'discord.js'
import type { Client } from 'discordx'
import { ApplicationCommandOptionType } from "discord.js";
import type { GuildMember, User } from 'discord.js'
import { EmbedBuilder } from "discord.js";
import { Pagination } from "@discordx/pagination";


function badges(member: any) {
  var badges = []
  const badge = member?.user.flags.toArray()
  if(member.user.bot) badges.push("🤖");
  if(member.user.system) badges.push("👨‍💻");
  if(member.guild.ownerId === member.id) badges.push("👑");
  badge.forEach((b:any) => {
    console.log(b)
    if(b === "ActiveDeveloper") badges.push("<:activeDeveloper:1044061996536049664>");
    if(b === "HypeSquadOnlineHouse1") badges.push("<:bravery:1044347767629295676>");
    if(b === "HypeSquadOnlineHouse2") badges.push("<:brillance:1044347892997046514>");
    if(b === "HypeSquadOnlineHouse3") badges.push("<:balance:1044347811908550716>");
  })
  return badges.join(" ");
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
       
       const embed = new EmbedBuilder()
       .setTitle("Informação de usuário")
       .setDescription(`${badges(member)}`)
       .setThumbnail(member?.user.displayAvatarURL({ size:4096 }))
       .addFields([
        {
          name: "🔢 • Tag",
          value: `${member?.user.tag ?? "Unknown"} ${member?.nickname ? `\`Vulgo ${member?.nickname}\``:""}`
        }
       ]);

       await interaction?.reply({embeds: [embed]})
     }

     @Slash({ name: "server", description: "Pegar informações de servidor" })
     async server(interaction: CommandInteraction) {
        await interaction?.reply("Server info")
     }
}