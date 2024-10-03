const { MongoClient } = require("mongodb");
const { readdir } = require("fs/promises");
const { debug } = require("console");

const uri = "mongodb://localhost:27017"; // Replace with your MongoDB URI
const client = new MongoClient(uri);


async function processImport(db, data) {
    try {
        // const collection = db.collection('vehicles-tmp');

        const processed = Object.values(data).map(async v => {
            let p = [];
            p.push(Object.entries(v).map(([k, v]) => ({
                _id: v.licensePlate + v._id + v.routeId,
                plate: v.licensePlate,
                routeId: v.routeId,
                headsign: v.label,
                model: v.model,
                tripId: v._id,
                loggedAt: v.seen,
                date: v.seen.split("T")[0] // Adding date-only field
            })))

                ;
            return p;
        })
        return processed;

    } catch (error) {
        console.error("[-] Error processing data:", error);
    }
}

async function main() {
    let sum = 0;
    const files = (await readdir("./dump")).sort()
    let processedData = [];
    await files.map(async file => {
        const data = require(`./dump/${file}`)
        try {
            console.log("[*] Connecting to MongoDB...");
            await client.connect();
            console.log("[+] Connected to MongoDB");
            const db = client.db('vehicleData');
            console.log(`[+] Processing ${file}`);
            sum += Object.values(data).length
            console.log(`[+] ${Object.values(data).length} entries`);
            processedData.push(await processImport(db, data));
        } catch (error) {
            console.error("[-] Error connecting to MongoDB:", error);
        }
    })
    console.log(`[+] Total entries: ${sum}`);
    /*  const n = require("./dump/state.json")
      console.dir(n["869"])
      console.dir(Object.entries(n).map(([k, v]) => [k, Object.values(v).length]));
      */
    /* try {
          console.log("[*] Connecting to MongoDB...");
          await client.connect();
          console.log("[+] Connected to MongoDB");
          const db = client.db('vehicleData');
          setInterval(() => px(db), 10000);
      } catch (error) {
          console.error("[-] Error connecting to MongoDB:", error);
      }
          */
    console.dir(processedData.flat().length)
}

main()
    .then(() => console.log("[+] Application started"))
    .catch(error => console.warn("[-] Application failed to start:", error));