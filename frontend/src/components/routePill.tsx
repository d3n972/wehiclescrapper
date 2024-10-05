'use client'
interface RoutePillProps {
    routeId: string;
    routeColor: string;
    routeTextColor: string;
    routeShortName: string;
    href?: string;
}

export function RoutePill({
    routeId,
    routeColor,
    routeTextColor,
    routeShortName,
    href 
}: RoutePillProps) {
    return (
        <span role={href?"button":""} key={routeId} style={{
            backgroundColor: "#" + routeColor,
            color: "#" + routeTextColor,
            width: "3rem",
            borderRadius: "0.5rem",
            fontWeight: "bold",
        }}
            onClick={()=>{href? window.location.href = `/route/${routeId}`:''} }
            className="d-flex m-x-3 m-y-1 w-auto text-decoration-none user-select-none">
            {routeShortName}
        </span>
    );
}