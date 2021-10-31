import Event from "../model/Event";
import { EventName } from "../model/EventName";
import discordClientService from "../service/DiscordClientService";
import Command from "../model/Command";
import studentRepository from "../repository/StudentRepository";
import discordUserRepository from "../repository/DiscordUserRepository";
import { ApplicationCommandResolvable } from "discord.js";
const { client } = discordClientService;

export default new Event(EventName.READY, async () => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID!)!;
  discordClientService.guild = guild;
  let { commands } = guild ? guild : client.application!;
  let configuredCommands = await Command.getConfiguredCommands();
  configuredCommands.forEach(command => commands.create(command.config));
  await studentRepository.updateStudentsData();
  await discordUserRepository.updateDiscordUsersData(true);
  console.log("Bot ready");
})