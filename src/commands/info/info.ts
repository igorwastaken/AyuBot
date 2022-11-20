import { interactions } from '../../interactions/main';
import { Command } from '../../structures/Command';
import { CommandInteractionOptionResolver } from 'discord.js'

export default new Command({
	interaction: interactions.info,
	excute: async ({ interaction }) => {
    if(!interaction.isChatInputCommand) return;
    console.log(interaction.options<CommandInteractionOptionResolver>.getSubcommand())
		await interaction?.reply(`Você usou \`\`\`json\n${interaction.options.toString()}\`\`\``)
	},
});