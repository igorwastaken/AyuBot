// import { ApplicationCommandOptionType } from 'discord.js';
import { interactionOptions } from '../../typings';

export const pingCommand = {
	name: 'ping',
	description: 'pong.',
	directory: 'utility',
	cooldown: 1000,
	permission: []
} as interactionOptions;