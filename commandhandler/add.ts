import DiscordJS from 'discord.js';
import Command from '../model/Command';
import { CommandName } from '../model/CommandName';

export default new Command(
  {
    name: 'add',
    description: 'adds two numbersasdsdasda',
    options: [
      {
        name: 'num1',
        description: 'the first number',
        required: true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
      },
      {
        name: 'num2',
        description: 'the second number',
        required: true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
      }
    ]
  }, 
  async (options) => {
    console.log(options);
  }
)