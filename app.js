const { writeFile } = require("fs/promises");

async function fetchData() {
    const r = await fetch("https://go.bkk.hu/api/query/v1/ws/otp/api/where/vehicles-for-location.json?lat=47.51152389058045&latSpan=0.0536376020654896&lon=19.06933642193823&lonSpan=0.10078281959248159&key=web-54feeb28-a942-48ae-89a5-9955879ebb2c&version=4&appVersion=3.18.0-164644-810354-e3dd8127", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,hu-HU;q=0.7,hu;q=0.6",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "cookie": "lang=hu",
            "Referer": "https://go.bkk.hu/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    });
    return (await r.json()).data.list
}
let j = {}

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function px() {
    let d = await fetchData()
    const processed = d.map(v => ({
        plate: v.licensePlate,
        routeId: v.routeId,
        headsign: v.label,
        model: v.model,
        _id: v.tripId,
        seen: (new Date()).toISOString()
    }))
    processed.forEach(v => {
        if (!(v.plate in j)) {
            j[v.plate] = {}
        }
        if (!(v._id in j[v.plate])) {
            j[v.plate][v._id] = v
            console.log(`[+] Logging ${v.plate} on trip ${v._id} (${v.routeId}: ${v.headsign})`)
        }
    });
    writeFile(`${(new Date()).toISOString().split("T")[0]}.json`, JSON.stringify(j))
}
/**
 * sd
 */
async function main() {
    setInterval(px, 60000)
}
main().then(e => { }).catch(e => console.warn(e))