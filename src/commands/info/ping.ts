import { interactions } from '../../interactions/main';
import { Command } from '../../structures/Command';
import { client } from '../../'

export default new Command({
	interaction: interactions.ping,
	excute: async ({ interaction }) => {
		await interaction.reply({ content: `Pong! \`${client.ws?.ping}ms\`` });
	},
});