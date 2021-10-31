import Event from "../model/Event";
import { EventName } from "../model/EventName";
import Command from "../model/Command";
import { InteractionReplyOptions } from "discord.js";
import EmbedUtils from "../util/EmbedUtils";

export default new Event(EventName.INTERACTION_CREATE, async (interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;
  let configuredCommands = await Command.getConfiguredCommands();
  let configuredCommand = configuredCommands.find(command => command.config.name === commandName);
  if (configuredCommand) {
    try {
      await configuredCommand.callback(interaction);
    } catch ({ message }) {
      let errorEmbed = EmbedUtils.buildErrorEmbed('Interna pogreška', message as string);
      let reply: InteractionReplyOptions = {
        ephemeral: !!interaction.ephemeral,
        embeds: [errorEmbed]
      }
      if (interaction.deferred) {
        interaction.editReply(reply);
      } else {
        interaction.reply(reply);
      }
    }
  }
})