import mongoose from 'mongoose';
import { IStudentDiscordUserCompositeKey, studentDiscordUserCompositeKeySchema } from './StudentDiscordUser';
const MODEL_NAME = 'Confirmation';
const Schema = mongoose.Schema;

export interface IConfirmation {
  _id: IStudentDiscordUserCompositeKey,
  confirmationCode: string
}

const confirmationSchema = new Schema({
  _id: studentDiscordUserCompositeKeySchema,
  confirmationCode: String
})

const Confirmation = mongoose.model<IConfirmation>(MODEL_NAME, confirmationSchema);
export default Confirmation;
