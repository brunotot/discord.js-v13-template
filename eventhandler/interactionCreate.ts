import Event from "../model/Event";
import { EventName } from "../model/EventName";
import Command from "../model/Command";

export default new Event(EventName.INTERACTION_CREATE, async (interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;
  let configuredCommands = await Command.getConfiguredCommands();
  let configuredCommand = configuredCommands.find(command => command.config.name === commandName);
  if (configuredCommand) configuredCommand.callback(interaction);
})