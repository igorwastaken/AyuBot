import { ApplicationCommandOptionType } from 'discord.js';
import { interactionOptions } from '../../typings';

export const infoCommand = {
	name: 'info',
	description: 'Pegar informações úteis',
	directory: 'info',
	cooldown: 10000,
	permission: [],
  options: [
    {
      name: "user",
      description: "Pegar informações do usuário.",
      type: ApplicationCommandOptionType.Subcommand
    },
    {
      name: "server",
      description: "Pegar informações do servidor.",
      type: ApplicationCommandOptionType.Subcommand
    }
	]
} as interactionOptions;