import Event from "../model/Event";
import { EventName } from "../model/EventName";
import Command from "../model/Command";
import { CommandInteractionOptionResolver } from "discord.js";

export default new Event(EventName.INTERACTION_CREATE, async (interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName, options } = interaction;
  let configuredCommands = await Command.getConfiguredCommands();
  const commandExecFn: (options: CommandInteractionOptionResolver) => any = 
    configuredCommands.find(command => command.config.name === commandName)?.callback ||
    function() {};
  commandExecFn(options);
})