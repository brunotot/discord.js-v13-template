import DiscordJS from 'discord.js';
import { ChannelTypes } from 'discord.js/typings/enums';
import Command from '../model/Command';
import { CommandName } from '../model/CommandName';

export default new Command(
  {
    name: CommandName.ANON,
    description: 'Anonimno šalje poruku u dani kanal.',
    channelTypes: ChannelTypes.DM,
    options: [
      {
        name: 'naziv_kanala',
        description: 'Naziv kanala (počni pisati i odaberi iz izbornika)',
        required: true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.CHANNEL
      }
    ]
  }, 
  async (interaction) => {
    interaction.reply({
      ephemeral: true,
      content: 'Uspjeh'
    })
  }
)