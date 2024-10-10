import { RouteDisplay } from "./routeSelector";

export function CollapsableRouteSelector() {
    return (
        <div className="accordion mt-1" id="CollapsableRouteSelector">
            <div className="accordion-item">
                <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                        Route Selector
                    </button>
                </h2>
                <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#CollapsableRouteSelector">
                    <div className="accordion-body">
                        <RouteDisplay />
                    </div>
                </div>
            </div>
        </div>
    )
}