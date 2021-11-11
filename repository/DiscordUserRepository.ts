import DiscordUser, { IDiscordUser } from "../schema/DiscordUser";
import discordClientService from "../service/DiscordClientService";
import BaseRepository from "./BaseRepository";

class DiscordUserRepository extends BaseRepository<IDiscordUser, String> {
  constructor() {
    super(DiscordUser);
  }

  updateDiscordUsersData: (force?: boolean) => Promise<void> = async (force: boolean = false) => {
    if (force || await this.isEmpty()) {
      await this.deleteAll();
      let allDiscordUsers = await discordClientService.getAllDiscordUsers();
      await this.saveOrUpdate(allDiscordUsers);
    }
  }
}

export default new DiscordUserRepository();