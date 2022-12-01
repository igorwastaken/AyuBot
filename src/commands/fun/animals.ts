import { Discord, Slash } from "discordx";
import { CommandInteraction, AttachmentBuilder } from 'discord.js'
import type { Client } from 'discordx'
import { Animality } from 'animality'
import type { Animal } from 'animality'
@Discord()
export class AnimalsCommands {
  @Slash({
    name: "cat",
    description: "Meow!"
  })

  async cat(interaction: CommandInteraction, client: Client): Promise<void> {
    const animal = await Animality.getAsync("cat", process.env.AnimalKey);
    const file = new AttachmentBuilder(animal.image);
    interaction?.reply({files: [file]});
  }
  
  @Slash({
    name: "dog",
    description: "Woof!"
  })
  async dog(interaction: CommandInteraction, client: Client): Promise<void> {
    const animal = await Animality.getAsync("dog", process.env.AnimalKey);
    const file = new AttachmentBuilder(animal.image);
    interaction?.reply({files: [file]});
  }
}