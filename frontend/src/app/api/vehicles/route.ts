import { DocumentDatabase } from "@/lib/mongodb";
import { createClient } from "redis";
import { ENV } from "@/lib/env";
import { type NextRequest } from "next/server";
async function getPlates() {
  const redis = createClient({
    url: ENV.REDIS_URL,
  });
  await redis.connect();
  const hasPlates = await redis.exists("vehicles");
  if (!hasPlates) {
    await DocumentDatabase.connect();
    const db = await DocumentDatabase.getDatabase("vehicleData");
    const vechicles = db.collection("vehicles");
    const platesCursor = vechicles.aggregate(
      [
        {
          $group: {
            _id: "$plate",
          },
        },
      ],
    );
    const plates = await platesCursor.toArray();
    const processedPlates = plates.map((plate) => {
      return {
        _id: plate._id,
        type: plate._id.startsWith("T")
          ? "Trolley"
          : plate._id.startsWith("V")
          ? "Tram"
          : "Bus",
      };
    });
    const n = await redis.set("vehicles", JSON.stringify(processedPlates), {
      EX: 600,
    });
    console.log(n);
  }
  const plates = JSON.parse(await redis.get("vehicles") ?? "[]");
  return plates;
}

export async function GET(
  request: NextRequest,
) {
  const filter = request.nextUrl.searchParams.get("type");
  console.log(filter);
  if (filter) {
    const plates = await getPlates();
    let f = [];
    switch (filter) {
      case "T":
        f = plates.filter((plate: { _id: string; type: string }) =>
          plate.type === "Trolley"&&plate._id.length !== 6
        );
        break;
      case "B":
        f = plates.filter((plate: { _id: string; type: string }) =>
          plate.type === "Bus"
        );
        break;
      case "V":
        f = plates.filter((plate: { _id: string; type: string }) =>
          plate.type === "Tram"&&plate._id.length !== 6
        );
        break;
      default:
        return new Response("Invalid filter", {});
    }

    return Response.json(
      f,
    );
  }
  const plates = await getPlates();
  return Response.json(plates);
}
