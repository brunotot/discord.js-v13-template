import Confirmation, { IConfirmation } from "../schema/Confirmation";
import { IStudentDiscordUserCompositeKey } from "../schema/StudentDiscordUser";
import BaseRepository from "./BaseRepository";

class ConfirmationRepository extends BaseRepository<IConfirmation, IStudentDiscordUserCompositeKey> {
  constructor() {
    super(Confirmation);
  }
}

export default new ConfirmationRepository();