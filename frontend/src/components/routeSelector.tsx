import { GTFSClient } from "@/lib/gtfs";
import { RoutePill } from "./routePill";
export async function RouteDisplay() {
    let g = new GTFSClient();
    return (
        <div className="row row-cols-5 gap-1">
            <RoutePill
                routeColor={"00eda0"}
                routeId={"ZZZ"}
                routeShortName={"ZZZ"}
                routeTextColor={"00000"}
                key={"x"} />
            {
                (await g.getRoutes()).sort().map((route: any) => {
                    return (
                        <RoutePill
                            routeColor={route.route_color}
                            routeId={route.route_id}
                            routeShortName={route.route_short_name}
                            routeTextColor={route.route_text_color}
                            key={route.route_id}
                            href={`/route/${route.route_id}`}
                            />
                    )
                })
            }
        </div>
    )
}