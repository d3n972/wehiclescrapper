import { RoutePill } from "@/components/routePill"
import { getRouteDetails } from "@/lib/apiclient/routeDetails"
export default async function Page({ params }: { params: { id: string } }) {
    const route = await getRouteDetails(params.id)
    return (
        <div>
            <div className="">
                <h1>{route.shortName}</h1>
                <span className="">
                <RoutePill routeShortName={route.shortName} routeId={route.id} routeColor={route.style.color} routeTextColor={route.style.textColor} key="x" />
            </span>
            </div>
            
            <p>

                {route.description}</p>
        </div>
    )
}