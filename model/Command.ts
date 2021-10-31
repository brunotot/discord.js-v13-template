import { CacheType, CommandInteraction } from "discord.js";
import path from 'path';
import fs from 'fs';

const COMMAND_HANDLERS_FOLDER = "./../commandhandler";

class Command {
  config: any;
  callback: (options: CommandInteraction<CacheType>) => any;

  constructor(
    config: any,
    callback: (interaction: CommandInteraction<CacheType>) => any
  ) {
    this.config = config;
    this.callback = callback;
  }

  static async getConfiguredCommands(): Promise<Command[]> {
    let configuredCommands: Command[] = [];
    const normalizedPathCommandHandlerFolder = path.join(__dirname, COMMAND_HANDLERS_FOLDER);
    let commandHandlerFiles = fs.readdirSync(normalizedPathCommandHandlerFolder);
    for (let commandHandlerFile of commandHandlerFiles) {
      let commandFileLocation = `${COMMAND_HANDLERS_FOLDER}/${commandHandlerFile}`;
      const res = await import(commandFileLocation);
      configuredCommands.push(res.default);
    }
    return configuredCommands;
  }
}

export default Command;