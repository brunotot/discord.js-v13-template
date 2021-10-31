import { FilterQuery, Model } from "mongoose";
import { IStudent } from "../schema/Student";

export default class BaseRepository<T, ID> {
  public model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public countAll = async (): Promise<number> => {
    return await this.model.count({});
  }

  public findByPredicate = async (predicate: (o: T) => boolean): Promise<T[]> => {
    let values = await this.model.find({});
    return values.filter(predicate);
  }

  public findById = async (_id: ID): Promise<T | null> => {
    let values: T[] = await this.model.find({_id});
    return values.length > 0 ? values[0] : null;
  }

  public removeAll = async (): Promise<any> => {
    await this.model.deleteMany({});
  }

  public saveOrUpdate = async (values: T | T[]): Promise<any> => {
    let valuesNormalized: T[] = Array.isArray(values) ? values : [values];
    await this.model.bulkWrite(valuesNormalized.map((value: any) => ({
      updateOne: {
        filter: {_id: value._id},
        update: value,
        upsert: true
      }
    })))
  }
}