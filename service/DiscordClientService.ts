import DiscordJS, { GuildMember, Intents } from 'discord.js'
import Event from '../model/Event';
import { Role } from '../model/Role';
import { IDiscordUser } from '../schema/DiscordUser';
import StringUtils from './../util/StringUtils';

class DiscordClientService {
  guild!: DiscordJS.Guild;
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
    let members = await this.guild.members.fetch();
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