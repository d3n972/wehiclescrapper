import { getRoutes, getStops, getTrips, importGtfs, openDb } from "gtfs";
import { createClient } from "redis";
import Database from "better-sqlite3";
import { ENV } from "./env";

export class GTFSClient {
  static config = {
    agencies: [
      {
        url: ENV.GTFS_URL,
      },
    ],
    sqlitePath: ENV.GTFS_STORAGE_PATH,
    verbose: false,
  };
  db: Database.Database;
  redis: any;
  static async importGtfsFile() {
    await importGtfs(GTFSClient.config);
  }
  constructor() {
    this.db = openDb(GTFSClient.config);
    this.redis = createClient({ url: ENV.REDIS_URL });
    this.redis.connect();
  }
  async getRoutes() {
    const hasCache = await this.redis.exists("gtfs:routes");
    if (!hasCache) {
      const routes = await getRoutes();
      await this.redis.set("gtfs:routes", JSON.stringify(routes), {
        EX: 86400,
      });
    }
    return JSON.parse(await this.redis.get("gtfs:routes") ?? "[]");
  }
  async getStops() {
    const hasCache = await this.redis.exists("gtfs:stops");
    if (!hasCache) {
      const stops = await getStops();
      await this.redis.set("gtfs:stops", JSON.stringify(stops), {
        EX: 86400,
      });
    }
    return JSON.parse(await this.redis.get("gtfs:stops") ?? "[]");
  }
  async getTrips() {
    const hasCache = await this.redis.exists("gtfs:trips");
    if (!hasCache) {
      const trips = await getTrips();
      await this.redis.set("gtfs:trips", JSON.stringify(trips), {
        EX: 86400,
      });
    }
    return JSON.parse(await this.redis.get("gtfs:trips") ?? "[]");
  }
}
