'use client'
import { useState, useEffect } from 'react';


const VehicleListPage = () => {
    const [vehicles, setVehicles] = useState([])
    async function getData() {
        const d = await (await fetch('/api/vehicles')).json()
        setVehicles(d)
    }
    async function filterByType(type: string) {
        if (type === 'A') {
            return
        }
        const d = await (await fetch(`/api/vehicles?type=${type}`)).json()
        setVehicles(d)
    }
    async function updateFilter(e: Event) {

    }
    useEffect(() => {

        getData()

    }, [])
    if (vehicles.length == 0) return <div>Loading...</div>

    return (
        <div>
            <div className="d-flex flex-row">
                <select className="form-select" onChange={e => filterByType(e.target.value)} aria-label="Default select example">
                    <option defaultValue={0} value="A">All</option>
                    <option value="V">Tram</option>
                    <option value="B">Bus</option>
                    <option value="T">Trolley</option>
                </select>
                <select className="form-select" aria-label="Default select example">
                    <option defaultValue={0}>Open this select menu</option>
                    <option value="T">Tram</option>
                    <option value="B">Bus</option>
                    <option value="T">Trolley</option>
                </select>
            </div>
            <table id='vehicleTable' className="table table-striped">
                <thead>
                    <tr>
                        <th>Plate</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        vehicles.map((vehicle: { _id: string, type: string }) => (
                            <tr key={vehicle._id}>
                                <td>{vehicle._id}</td>
                                <td>
                                    {vehicle.type}
                                </td>
                                <td>
                                <i className="bi bi-train-front"></i>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default VehicleListPage;