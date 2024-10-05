import { MongoClient } from "mongodb";
import { ENV } from "./env";

const client = new MongoClient(ENV.MONGO_CONNECTION_STRING);

export class DocumentDatabase {
  static async connect() {
    await client.connect();
  }

  static async disconnect() {
    await client.close();
  }
  static async getDatabase(name: string) {
    return client.db(name);
  }
  static async getCollection(collection: string) {
    return client.db().collection(collection);
  }
}
