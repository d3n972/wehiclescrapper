/**
 * @license
 * This code is proprietary and confidential.
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 * All rights reserved.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { RedisClientType } from "redis";

/**
 * @typedef {import("redis").RedisClient} RedisClientType
 * @typedef {import("redis").Multi} MultiType
 * @typedef {import("redis").Redis} RedisType
 * @typedef {import("redis").Pipeline} PipelineType
 * @typedef {import("redis").PipelineCommand} PipelineCommandType
 * @typedef {import("redis").PipelinePromise} PipelinePromiseType
 * @typedef {import("redis").PipelineCallback} PipelineCallbackType
 * @typedef {import("redis").PipelineCommandCallback} PipelineCommandCallbackType
 */

//Todo: Assign keys dynamically from the field's value present in
export {};
const { readFile, readdir } = require("fs").promises;
const { createClient } = require("redis");

/**
 * Represents a row in a CSV file where each key is a column name and the value is the corresponding cell value.
 *
 * @interface CSVRow
 * @property {string} [key] - The key representing the column name.
 * @property {string} value - The value corresponding to the column name.
 */
interface CSVRow {
  [key: string]: string;
}

/**
 * Parses a CSV string and converts it into an array of objects, where each object represents a row in the CSV.
 * The keys of the objects are derived from the header row of the CSV.
 *
 * @param csvString - The CSV string to be parsed.
 * @returns A promise that resolves to an array of CSVRow objects.
 */
async function parseCSV(csvString: string): Promise<CSVRow[]> {
  const rows: CSVRow[] = [];
  const lines = csvString.split("\n");
  let headers: string[] = [];

  for (const line of lines) {
    if (line === "") {
      continue;
    }
    const values = parseCSVLine(line);

    if (headers.length === 0) {
      headers = values;
    } else {
      const row: CSVRow = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      rows.push(row);
    }
  }
  return rows;
}

/**
 * Parses a single line of a CSV file into an array of strings.
 *
 * This function handles quoted values and escaped quotes within quoted values.
 * It splits the line by commas, except when the commas are within quoted values.
 *
 * @param line - The CSV line to parse.
 * @returns An array of strings representing the parsed values from the CSV line.
 *
 * @throws Will throw an error if any value in the parsed result is undefined.
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"' && (i === 0 || line[i - 1] !== "\\")) {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  result.map((value) => {
    if (value == undefined) {
      throw new Error("Value is undefined");
    }
  });
  return result.map((value) =>
    value.replace(/^"|"$/g, "").replace(/\\"/g, '"')
  );
}

/**
 * Main function to import GTFS data files into Redis.
 *
 * This function performs the following steps:
 * 1. Records the start time.
 * 2. Reads the list of files from the specified directory.
 * 3. Connects to a Redis instance and flushes all existing data.
 * 4. Iterates over each file in the directory:
 *    - Skips files that are not of the types: "routes", "shapes", "stop_times", "stops", "trips".
 *    - Logs the type of the file being processed.
 *    - Imports data from the file into Redis.
 * 5. Disconnects from Redis.
 * 6. Logs the total elapsed time for the operation.
 *
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
async function main() {
  const startTime = Date.now();
  const files = await readdir("/home/markadonyi/Downloads/budapest_gtfs");
  const redis = await getRedis();
  await redis.flushAll();
  for (const file of files) {
    const fileType = file.split("/").pop()?.split(".")[0];

    if (
      !["routes", "shapes", "stop_times", "stops", "trips"].includes(fileType!)
    ) {
      console.log("Skipping", fileType);
      continue;
    }
    console.log(fileType);
    await importDataFromFile(
      redis,
      `/home/markadonyi/Downloads/budapest_gtfs/${file}`,
      fileType as string,
    );
  }
  await redis.disconnect();
  console.log("Total elapsed time:", Date.now() - startTime);
}

/**
 * Establishes a connection to a Redis server and returns a Redis client instance.
 *
 * @returns {Promise<RedisClientType>} A promise that resolves to a Redis client instance.
 *
 * @throws {Error} If the connection to the Redis server fails.
 */
async function getRedis(): Promise<RedisClientType> {
  const redis = await createClient({ "url": "redis://localhost:6379" });
  await redis.connect();
  return redis;
}

/**
 * Imports data from a CSV file and stores it in a Redis database.
 *
 * @param {null | any} redis - The Redis client instance. Can be null.
 * @param {string} filePath - The path to the CSV file to be imported.
 * @param {string} fileType - The type of file being imported, used as a prefix for Redis keys.
 *
 * @returns {Promise<void>} A promise that resolves when the import is complete.
 *
 * @throws Will log an error message if parsing the CSV fails.
 *
 * @example
 * ```typescript
 * const redisClient = new Redis();
 * await importDataFromFile(redisClient, '/path/to/file.csv', 'myFileType');
 * ```
 */
async function importDataFromFile(
  redis: null | any,
  filePath: string,
  fileType: string,
) {
  const csvString = await readFile(
    filePath,
    "utf8",
  );
  const time = Date.now();
  try {
    const data = await parseCSV(csvString);
    const dataLength = data.length;
    console.log(`Parsed ${dataLength} rows`);
    const batchSize = 100000;
    for (let i = 0; i < dataLength; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      console.log(
        `Processing batch ${i / batchSize + 1} with ${batch.length} rows`,
      );
      const multi = redis.multi();
      batch.forEach((row, j) => {
        multi.hSet(`${fileType}:${i + j}`, row as Record<string, string>);
      });
      await multi.exec();
    }
    // console.dir(z);
  } catch (error) {
    console.error("Error parsing CSV:", error);
  }
  const elapsed = Date.now() - time;
  console.log(`Elapsed time: ${elapsed}ms`);
}

main().then(() => console.log("Done")).catch(console.error);
