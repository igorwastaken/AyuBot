import { Client, Collection, ClientEvents, GatewayIntentBits as Intent } from 'discord.js';
import { commandType } from '../typings';
import { Event } from './Event';
import {readdirSync} from 'node:fs'

export class ExtendedClient extends Client {
  public commands: Collection<string, commandType> = new Collection();

  
  constructor(options: any) {
    super({
      ...options,
      intents: [Intent.Guilds],
      partials: [],
      failIfNotExists: true,
      allowedMentions: { repliedUser: false }
    })
    
    this.run()
  }
  private async run() {
    await this.registerModules();
    await super.login(process.env.DISCORD_TOKEN).then(() => {
      this.handlerErrors()
    })
  }
  private async importFiles(path: string) {
    return (await import(path))?.default;
  }
  /**
  * INFO: The code below was taken from a template - Ayu
  */
  private async registerModules() {
		// Commands
		console.log('Registering commands...');
		for (const category of readdirSync(`${__dirname}/../commands`)) {
			for (const fileName of readdirSync(`${__dirname}/../commands/${category}`)) {
				const filePath = `${__dirname}/../commands/${category}/${fileName}`;
				const command: commandType = await this.importFiles(filePath.toString());

				this.commands.set(command.interaction.name, command);
			}
		}
		console.log('Registered commands');

		// Events
		console.log('Registering events...');
		for (const category of readdirSync(`${__dirname}/../events`)) {
			if (category.endsWith('.ts') || category.endsWith('.js')) {
				const filePath = `${__dirname}/../events/${category}`;
				const event: Event<keyof ClientEvents> = await this.importFiles(filePath.toString());
				this.on(event.event, event.run);
			} else {
				for (const fileName of readdirSync(`${__dirname}/../events/${category}`)) {
					const filePath = `${__dirname}/../events/${category}/${fileName}`;
					const event: Event<keyof ClientEvents> = await this.importFiles(filePath.toString());
					this.on(event.event, event.run);
				}
			}
		}
		console.log('Registered events');
  }
  private handlerErrors() {
		process.on('unhandledRejection', (reason: Error) => {
			console.log('\n' + reason.stack);
		});
		process.on('uncaughtException', (reason: Error) => {
			console.log('\n' + reason.stack);
		});
		process.on('warning', (reason: Error) => {
			console.log('\n' + reason.stack);
		});
		process.on('disconnect', () => {
			this.destroy();
		});
		process.on('beforeExit', () => {
			this.destroy();
		});
		process.on('exit', () => {
			this.destroy();
		});
                }
}