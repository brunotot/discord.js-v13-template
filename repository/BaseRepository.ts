import { Model } from "mongoose";

export default class BaseRepository<T, ID> {
  public model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public isEmpty = async (): Promise<boolean> => {
    return await this.countAll() === 0;
  }

  public deleteById = async (id: ID): Promise<void> => {
    await this.model.findByIdAndRemove(id);
  }

  public countAll = async (): Promise<number> => {
    return await this.model.count({});
  }

  public findOneByPredicate = async (predicate: (o: T) => boolean): Promise<T | null> => {
    let values = await this.model.find({});
    let filteredValues = values.filter(predicate);
    return filteredValues.length > 0 ? filteredValues[0] : null;
  }

  public findByPredicate = async (predicate: (o: T) => boolean): Promise<T[]> => {
    let values = await this.model.find({});
    return values.filter(predicate);
  }

  public findById = async (_id: ID): Promise<T | null> => {
    return await this.model.findOne({_id});
  }

  public deleteAll = async (): Promise<void> => {
    await this.model.deleteMany({});
  }

  public saveOrUpdate = async (values: T | T[]): Promise<T[]> => {
    let valuesNormalized: T[] = Array.isArray(values) ? values : [values];
    let bulkWriteConfigs = valuesNormalized.map((value: any) => ({
      updateOne: {
        filter: {_id: value._id},
        update: value,
        upsert: true
      }
    }))
    await this.model.bulkWrite(bulkWriteConfigs);
    return valuesNormalized;
  }
}