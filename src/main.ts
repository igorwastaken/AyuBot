import { dirname, importx } from "@discordx/importer";
import type { CommandInteraction, Interaction, Message } from "discord.js";
import { IntentsBitField, Partials } from "discord.js";
import * as dotenv from 'dotenv'
dotenv.config();
import { Client } from "discordx";

import { Koa } from "@discordx/koa";

import sql from './structures/database'
export const bot = new Client({
  partials: [Partials.Channel, Partials.Message],
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
  silent: true,
  simpleCommand: { prefix: "ay." }
});

bot.once("ready", async () => {
  await bot.initApplicationCommands();
  setInterval(() => {
    bot.user?.setActivity({name: `${bot.guilds.cache.size} Servers | ${bot.users.cache.size} Users | v1.beta`})
  }, 30000)
});
bot.on("interactionCreate", async(interaction: any) => {
  const data = await sql`
   SELECT * FROM guilds
   WHERE id = ${interaction.guild.id}
  `
  if(!data[0]) {
    const insertData = await sql`
     INSERT INTO guilds ( id ) VALUES ( ${interaction.guild.id} )
    `
    console.log(data)
  }
});
bot.on("interactionCreate", async(interaction: Interaction) => {
  try {
    bot.executeInteraction(interaction);
  } catch(e) {
    console.log(e)
  }
});

bot.on("messageCreate", (message: Message) => {
  bot.executeCommand(message);
});

async function run() {
  await importx(`${dirname(import.meta.url)}/{events,commands,api}/**/*.{ts,js}`);

  
  if (!process.env.BOT_TOKEN) {
    throw Error("Could not find BOT_TOKEN in your environment");
  }
  
  await bot.login(process.env.BOT_TOKEN);
  const server = new Koa();

  // api: need to build the api server first
  await server.build();

  // api: let's start the server now
  const port = process.env.PORT ?? 3000;
  server.listen(port, () => {
    console.log(`discord api server started on ${port}`);
    console.log(`visit localhost:${port}/guilds`);
  });
}

run();