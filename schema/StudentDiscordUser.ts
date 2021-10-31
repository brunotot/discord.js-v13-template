import { IStudent, studentSchema } from "./Student";

import mongoose from 'mongoose';
import { discordUserSchema, IDiscordUser } from "./DiscordUser";
const Schema = mongoose.Schema;

export interface IStudentDiscordUserCompositeKey {
  discordId: string,
  email: string
}

export interface IStudentDiscordUser {
  _id: IStudentDiscordUserCompositeKey,
  discordUser: IDiscordUser,
  student: IStudent
}

export const studentDiscordUserCompositeKeySchema = new Schema({
  _id: false,
  discordId: {type: String, required: true, index: true, unique: true},
  email: {type: String, required: true, index: true, unique: true}
} as any)

export const studentDiscordUserSchema = new Schema({
  _id: studentDiscordUserCompositeKeySchema,
  discordUser: discordUserSchema,
  student: studentSchema
})

const StudentDiscordUser = mongoose.model('StudentDiscordUser', studentDiscordUserSchema);
export default StudentDiscordUser;
