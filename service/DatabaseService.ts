import mongoose, { ConnectOptions } from "mongoose";
import studentRepository from "../repository/StudentRepository";
import { IStudent } from "../schema/Student";
import ScraperService from "./ScraperService";

export default (async function() {
  class DatabaseService {
    private config: ConnectOptions = {
      keepAlive: true
    };

    async init() {
      await mongoose.connect(
        process.env.MONGO_URI!,
        this.config
      )
    }
  }

  const databaseService = new DatabaseService();
  await databaseService.init();
  return databaseService
})();