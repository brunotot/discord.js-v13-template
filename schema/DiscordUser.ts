import mongoose from 'mongoose';
import { Role } from '../model/Role';
const MODEL_NAME = 'DiscordUser';
const Schema = mongoose.Schema;

export interface IDiscordUser {
  _id: string,
  bot: boolean;
  username: string;
  fullUsername: string,
  discriminator: string;
  redovni: boolean,
  verified: boolean,
  nickname: string;
  roles: Role[];
}

export const discordUserSchema = new Schema({
  _id: String,
  bot: Boolean,
  username: String,
  fullUsername: String,
  redovni: Boolean,
  verified: Boolean,
  discriminator: String,
  nickname: String,
  roles: [{
    type: String,
    enum: Object.values(Role)
  }]
})

const DiscordUser = mongoose.model<IDiscordUser>(MODEL_NAME, discordUserSchema);
export default DiscordUser;