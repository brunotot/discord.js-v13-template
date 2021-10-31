import StudentDiscordUser, { IStudentDiscordUser, IStudentDiscordUserCompositeKey } from "../schema/StudentDiscordUser";
import BaseRepository from "./BaseRepository";

class StudentDiscordUserRepository extends BaseRepository<IStudentDiscordUser, IStudentDiscordUserCompositeKey> {
  constructor() {
    super(StudentDiscordUser);
  }

  findByEmail = async (email: string) => {
    let results = await this.findByPredicate(sdu => sdu._id.email === email);
    return results.length > 0 ? results[0] : null;
  }

  findByDiscordId = async (discordId: string) => {
    let results = await this.findByPredicate(sdu => sdu._id.discordId === discordId);
    return results.length > 0 ? results[0] : null;
  }
}

export default new StudentDiscordUserRepository();