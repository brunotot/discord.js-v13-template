import dotenv from 'dotenv';
import discordClientService from './service/DiscordClientService'
import Event from './model/Event';
dotenv.config();

Event.getConfiguredEvents()
  .then(events => {
    events.forEach(event => discordClientService.on(event));
    discordClientService.init();
  });