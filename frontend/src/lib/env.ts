import { env } from "process";

export const ENV = {
  API_URL: env.API_URL || "http://localhost:3000",
  REDIS_URL: env.REDIS_URL || "redis://localhost:6379",
  NODE_ENV: env.NODE_ENV || "development",
  PORT: env.PORT || 3000,
  PUBLIC_URL: env.PUBLIC_URL || "http://localhost:3000",
  MONGO_CONNECTION_STRING: env.MONGO_CONNECTION_STRING || "mongodb://pi4:31210",
  GTFS_URL: env.GTFS_URL || "https://go.bkk.hu/api/static/v1/public-gtfs/budapest_gtfs.zip",
  GTFS_STORAGE_PATH: env.GTFS_STORAGE_PATH || "/tmp/gtfs",
};
