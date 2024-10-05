import { RouteDisplay } from "@/components/routeSelector";
import { GTFSClient } from "@/lib/gtfs";

export default async function ImportPage() {
  //await GTFSClient.importGtfsFile();
  let g = new GTFSClient();

  return (
    <div className="mx-auto">
      <div className="">


      </div>
      <div className="">
        <h1>Import GTFS</h1>
        <a className="btn btn-primary" role={"button"}>Import GTFS</a>
      </div>
      <div className=" d-flex row row-cols-3 mt-3">
        <div>
          <h1>Routes</h1>
          <p>Routes in the database: {(await g.getRoutes()).length}</p>
        </div>
        <div>
          <h1>Stops</h1>
          <p>Stops in the database: {(await g.getStops()).length}</p>
        </div>
        <div>
          <h1>Trips</h1>
          <p>Trips in the database: {(await g.getTrips()).length}</p>
        </div>
      </div>
      <div>
         <RouteDisplay />
        </div>
    </div>
  );
}