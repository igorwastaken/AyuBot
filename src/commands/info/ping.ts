import { interactions } from '../../interactions/main';
import { Command } from '../../structures/Command';

export default new Command({
	interaction: interactions.ping,
	excute: async ({ interaction }) => {
		await interaction.reply({ content: "pong" });
	},
});