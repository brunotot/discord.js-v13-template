import mongoose from "mongoose";
import Event from "../model/Event";
import { EventName } from "../model/EventName";
import discordClientService from "../service/DiscordClientService";
import Command from "../model/Command";
const { client } = discordClientService;

export default new Event(EventName.READY, async () => {
  console.log("Bot is ready!");
  
  await mongoose.connect(
    process.env.MONGO_URI || '',
    {keepAlive: true}
  )

  const GUILD_ID = '607231539713146923';
  const guild = client.guilds.cache.get(GUILD_ID);
  let { commands } = guild ? guild : client.application!;
  let configuredCommands = await Command.getConfiguredCommands();
  configuredCommands.forEach(command => commands.create(command.config));
})