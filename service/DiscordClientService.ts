import DiscordJS, { Intents } from 'discord.js'
import Event from '../model/Event';

class DiscordClientService {
  private guild!: DiscordJS.Guild;
  client: DiscordJS.Client;
  intents: DiscordJS.IntentsString[] | number[]; 

  constructor() {
    this.intents = [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.DIRECT_MESSAGES
    ];
    this.client = new DiscordJS.Client({
      intents: this.intents
    })
  }

  on(event: Event) {
    this.client.on(
      event.eventName, 
      event.callback as any
    );
  }

  init(): void {
    this.client.login(process.env.TOKEN);
  }
}

export default new DiscordClientService();