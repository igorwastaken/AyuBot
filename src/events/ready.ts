import type { ArgsOf, Client } from "discordx";
import { Discord, On } from "discordx";

@Discord()
export class Example {
  @On()
  ready([message]: ArgsOf<"ready">, client: Client): void {
    console.log("Bot online")
  }
}