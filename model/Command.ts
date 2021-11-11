import { CacheType, CommandInteraction } from "discord.js";
import ImportUtils from "../util/ImportUtils";

const COMMAND_HANDLERS_FOLDER = "./../commandhandler";

export default class Command {
  private static configuredCommands: Command[] = [];
  config: any;
  callback: (options: CommandInteraction<CacheType>) => Promise<any>;

  constructor(
    config: any,
    callback: (interaction: CommandInteraction<CacheType>) => any
  ) {
    this.config = config;
    this.callback = callback;
  }

  static async getConfiguredCommands(): Promise<Command[]> {
    if (Command.configuredCommands.length > 0) return Command.configuredCommands;
    let configuredCommands = await ImportUtils.getConfiguredImports<Command>(COMMAND_HANDLERS_FOLDER);
    Command.configuredCommands = configuredCommands;
    return configuredCommands;
  }
}