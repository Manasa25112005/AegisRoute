import { useEffect, useState } from "react";
import "../styles/GatewayManagement.css";
import { providerIcons } from "../data/providerIcons";

function GatewayManagementTable() {

    const [gateways, setGateways] = useState([]);

    useEffect(() => {

        fetch("http://localhost:8080/gateways")
            .then(response => response.json())
            .then(data => {
                setGateways(data);
            })
            .catch(error => {
                console.error("Error fetching gateways:", error);
            });

    }, []);

    return (

        <div className="gatewayTable">

            <h2>Gateway Configuration</h2>

            <table>

                <thead>

                <tr>

                    <th>Gateway</th>
                    <th>Status</th>
                    <th>Health</th>
                    <th>Current Latency</th>
                    <th>Cost</th>
                    <th>Circuit Breaker</th>

                </tr>

                </thead>

                <tbody>

                {gateways.map((g) => {

                    const status =
                        g.status === "UP"
                            ? "Online"
                            : "Down";

                    const circuit =
                        g.circuitOpen
                            ? "OPEN"
                            : "CLOSED";

                    return (

                        <tr key={g.id}>

                            <td className="gatewayName">

                                    <span className="tableIcon">
                                        {providerIcons[g.gatewayName]}
                                    </span>

                                {g.gatewayName}

                            </td>

                            <td>
                                {status}
                            </td>

                            <td>
                                {g.health !== undefined &&
                                g.health !== null
                                    ? `${Number(g.health).toFixed(1)}%`
                                    : "—"
                                }
                            </td>

                            <td>
                                {g.responseTime} ms
                            </td>

                            <td>
                                ${Number(g.cost).toFixed(3)}
                            </td>

                            <td>
                                {circuit}
                            </td>

                        </tr>

                    );

                })}

                </tbody>

            </table>

        </div>

    );

}

export default GatewayManagementTable;