import mongoose from 'mongoose';
import { IStudijData, StudijDataSchema } from './StudijData';
const MODEL_NAME = 'Student';
const Schema = mongoose.Schema;

export interface IStudent {
  jmbag: string,
  ime: string,
  prezime: string,
  _id: string,
  telefon: string,
  studijData: IStudijData
}

export const studentSchema = new Schema({
  jmbag: String,
  ime: String,
  prezime: String,
  _id: String,
  telefon: String,
  studijData: StudijDataSchema
})

const Student = mongoose.model<IStudent>(MODEL_NAME, studentSchema);
export default Student;
