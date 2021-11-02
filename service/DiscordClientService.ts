import DiscordJS, { Intents, MessageEmbed, TextChannel } from 'discord.js'
import Event from '../model/Event';
import { Role } from '../model/Role';
import { IDiscordUser } from '../schema/DiscordUser';

class DiscordClientService {
  guild!: DiscordJS.Guild;
  client: DiscordJS.Client;
  intents: DiscordJS.IntentsString[] | number[]; 
  notifications: {title: string, text: string}[] = [];

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

  normalizeChannelName = (channelName: string = ''): string => {
    let re = new RegExp(' ', 'g');
    return channelName.replace(re, '-').toLowerCase();
  }

  getChannelByName(channelName: string): TextChannel | null {
    let normalizedChannelName: string = this.normalizeChannelName(channelName);
    let channel = this.guild.channels.cache.find(c => c.name === normalizedChannelName);
    return channel ? channel as TextChannel : null;
  }

  async sendNotification(channelId: string | TextChannel, embeds: MessageEmbed | MessageEmbed[]) {
    if (embeds.length === 0) {
      console.log("embeds empty.");
      return;
    }
    let embed = Array.isArray(embeds) ? embeds[0] : embeds;
    let { title, description: text } = embed;

    let isAlreadyQueuedNotification: boolean = !!this.notifications.find(o => o.title === title && o.text === text);
    if (!isAlreadyQueuedNotification) {
      this.notifications.push({ title: title as string, text: text as string });
      await this.sendToChannel(channelId, ':loudspeaker: **Nova obavijest** :loudspeaker: @here', embeds);
    }
  }

  async sendToChannel(channelId: string | TextChannel, messageContent: string, embeds: MessageEmbed | MessageEmbed[] = []) {
    let messageOptions: {[key: string]: any} = {
      ephemeral: true,
      content: messageContent,
      embeds: Array.isArray(embeds) ? embeds : [embeds]
    };
    if (typeof channelId === 'string') {
      let channel: TextChannel = this.guild.channels.cache.get(channelId) as TextChannel;
      if (messageContent === '') delete messageOptions['content'];
      await channel.send(messageOptions);
    } else {
      await channelId.send(messageOptions);
    }
  }

  memberToDiscordUserMapperFn = (m: any) => {
    let nickname = m.nickname || m.user.username;
    let roles: Role[] = m._roles || [];
    let _id = m.user.id;
    let bot = m.user.bot;
    let discriminator = m.user.discriminator;
    let username = m.user.username;
    let fullUsername = `${username}#${discriminator}`;
    let redovni = roles.includes(Role.REDOVNI);
    let verified = roles
      .filter(r => Object
        .values(Role)
        .includes(r))
      .length > 0;
    return {
      _id, 
      bot,
      discriminator,
      nickname,
      roles,
      username,
      fullUsername,
      redovni,
      verified
    }
  }

  async getAllDiscordUsers(): Promise<IDiscordUser[]> {
    let members = await this.guild?.members.fetch() || [];
    let membersArray = Array.from(members);
    return membersArray.map(l => this.memberToDiscordUserMapperFn(l[1]));
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