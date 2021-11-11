import DiscordJS, { Intents, MessageEmbed, TextChannel } from 'discord.js'
import Event from '../model/Event';
import { Role } from '../model/Role';
import { IDiscordUser } from '../schema/DiscordUser';
import NotificationUtils from '../util/NotificationUtils';

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

  async getGuildMemberById(memberId: string): Promise<DiscordJS.GuildMember | undefined> {
    return await this.guild.members.fetch(memberId);
  }

  async setUserNickname(memberId: string, nickname: string) {
    let member = await this.getGuildMemberById(memberId);
    await member?.setNickname(nickname);
  }

  async setUserRole(memberId: string, role: Role) {
    let member = await this.getGuildMemberById(memberId);
    let roleDiscord = await this.getDiscordRoleByRole(role);
    await member?.roles.add(roleDiscord);
  }

  async getDiscordRoleByRole(role: Role): Promise<DiscordJS.Role> {
    return await this.guild.roles.fetch(role) as DiscordJS.Role;
  }

  normalizeChannelName = (channelName: string = ''): string => {
    let regex = NotificationUtils.getGlobalRegex(' ');
    let replacement = '-';
    return channelName
      .replace(regex, replacement)
      .toLowerCase();
  }

  async getChannelByName(channelName: string): Promise<TextChannel | null> {
    let normalizedChannelName: string = this.normalizeChannelName(channelName);
    let guildChannelManager = this.guild.channels;
    let cache = guildChannelManager.cache;
    let channel = cache.find(c => c.name === normalizedChannelName);
    if (!cache.hasAny()) {
      let allChannels = await guildChannelManager.fetch();
      channel = allChannels.find(c => c.name === normalizedChannelName);
    }
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
      await this.sendToChannel(channelId, ':loudspeaker: **Nova obavijest** :loudspeaker: ', embeds);
    }
  }

  async getChannelById(channelId: string): Promise<TextChannel> {
    let channel = await this.guild.channels.fetch(channelId);
    if (!channel) throw new Error(`Channel[id=${channelId}] does not exist`);
    return channel as TextChannel;
  }

  async sendToChannel(
    channelId: string | TextChannel, 
    messageContent: string, 
    embeds: MessageEmbed | MessageEmbed[] = []
  ) {
    let messageOptions: DiscordJS.MessageOptions = {
      content: messageContent,
      embeds: Array.isArray(embeds) ? embeds : [embeds]
    };
    if (typeof channelId === 'string') {
      let channel = await this.getChannelById(channelId)!;
      if (messageContent === '') delete messageOptions['content'];
      await channel.send(messageOptions);
    } else {
      await channelId.send(messageOptions);
    }
  }

  getGuildMemberRoles = (m: DiscordJS.GuildMember): Role[] => {
    return m.roles.cache.map(role => {
      let roleNameUppercase = role.name.toUpperCase();
      return Role[roleNameUppercase as keyof typeof Role]
    })
  }

  memberToDiscordUserMapperFn = (m: DiscordJS.GuildMember) => {
    let roles = this.getGuildMemberRoles(m);
    return {
      _id: m.user.id, 
      bot: m.user.bot,
      discriminator: m.user.discriminator,
      nickname: m.nickname || m.user.username,
      roles: roles,
      username: m.user.username,
      fullUsername: `${m.user.username}#${m.user.discriminator}`,
      redovni: roles.includes(Role.REDOVNI),
      verified: roles
        .filter(r => Object
        .values(Role)
        .includes(r))
      .length > 0
    }
  }

  async getAllGuildMembers(): Promise<DiscordJS.GuildMember[]> {
    let membersCollection = await this.guild.members.fetch();
    return membersCollection.map(member => member);
  }

  async getAllDiscordUsers(): Promise<IDiscordUser[]> {
    let guildMembers = await this.getAllGuildMembers();
    return guildMembers.map(this.memberToDiscordUserMapperFn);
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