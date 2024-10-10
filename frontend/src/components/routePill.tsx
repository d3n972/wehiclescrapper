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
            maxWidth: "3rem",
            maxHeight: "1.5rem",
            width: "3rem",
            borderRadius: "0.5rem",
            fontWeight: "bold",
        }}
            onClick={()=>{href? window.location.href = `/route/${routeId}`:''} }
            className="align-content-center d-flex fle0 justify-content-center m-x-3 m-y-1 text-decoration-none user-select-none w-auto">
            {routeShortName}
        </span>
    );
}