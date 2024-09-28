const { MongoClient } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const API_URL = process.env.API_URL || "https://go.bkk.hu/api/query/v1/ws/otp/api/where/vehicles-for-location.json?lat=47.51152389058045&latSpan=0.0536376020654896&lon=19.06933642193823&lonSpan=0.10078281959248159&key=web-54feeb28-a942-48ae-89a5-9955879ebb2c&version=4&appVersion=3.18.0-164644-810354-e3dd8127";
const FETCH_INTERVAL = process.env.FETCH_INTERVAL || 10000;

const client = new MongoClient(MONGODB_URI);

async function fetchData() {
    console.log("[*] Fetching data from API...");
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log("[+] Data fetched successfully");
    return data.data.list;
}

async function processVehicleData(db) {
    try {
        const data = await fetchData();
        const currentDate = new Date().toISOString().split('T')[0];
        const processedData = data.map(vehicle => ({
            updateOne: {
                filter: { _id: `${vehicle.licensePlate}${vehicle.tripId}${vehicle.routeId}${currentDate}` },
                update: {
                    $setOnInsert: {
                        _id: `${vehicle.licensePlate}${vehicle.tripId}${vehicle.routeId}${currentDate}`,
                        plate: vehicle.licensePlate,
                        routeId: vehicle.routeId,
                        headsign: vehicle.label,
                        model: vehicle.model,
                        tripId: vehicle.tripId,
                        loggedAt: new Date().toISOString(),
                        date: currentDate
                    }
                },
                upsert: true
            }
        }));

        const collection = db.collection('vehicles');
        const result = await collection.bulkWrite(processedData);
        console.log(`[+] Logged ${result.upsertedCount} vehicles`);
    } catch (error) {
        console.error("[-] Error processing data:", error);
    }
}

async function main() {
    try {
        console.log("[*] Connecting to MongoDB...");
        await client.connect();
        console.log("[+] Connected to MongoDB");
        const db = client.db('vehicleData');
        const intervalId = setInterval(() => processVehicleData(db), FETCH_INTERVAL);

        // Graceful shutdown
        process.on('SIGTERM', async () => {
            console.log("[*] SIGTERM signal received: closing MongoDB connection");
            clearInterval(intervalId);
            await client.close();
            console.log("[+] MongoDB connection closed");
            process.exit(0);
        });

        process.on('SIGINT', async () => {
            console.log("[*] SIGINT signal received: closing MongoDB connection");
            clearInterval(intervalId);
            await client.close();
            console.log("[+] MongoDB connection closed");
            process.exit(0);
        });

    } catch (error) {
        console.error("[-] Error connecting to MongoDB:", error);
    }
}

main()
    .then(() => console.log("[+] Application started"))
    .catch(error => console.warn("[-] Application failed to start:", error));