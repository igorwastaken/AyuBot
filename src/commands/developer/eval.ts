import { Discord, SimpleCommand, SimpleCommandMessage} from 'discordx'
import { inspect } from 'util'
import type {Client} from 'discordx'
import sql from '../../structures/database'

@Discord()
class Example {
  @SimpleCommand({ aliases: ["e"], name: "eval" })
  async eval(command: SimpleCommandMessage, client: Client) {
    const message = command.message;
    if(!['407859300527243275'].includes(message.author.id)) return;
  
    const code = command.argString
    if (!code) return message.reply('Forneça algum código!'); // Bot returns if no code is given like `message.author.id`

    try {
        const result = await eval(code);
        let output = result;
        if(typeof result !== 'string') {
            output = inspect(result);
        }
        message.reply(`\`\`\`js\n${output}\`\`\``);  
    } catch (error) {
        console.log(error)
        message.reply({ content:':x: Desculpe, isso não funcionou ou demorou muito para enviar' }); // returns message if error
    }
  }
}