import { useEffect, useState } from "react";
import "../styles/GatewayManagement.css";
import { providerIcons } from "../data/providerIcons";

function GatewayManagementCards() {

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

        <div className="gatewayCards">

            {gateways.map((g) => {

                const color =
                    g.gatewayName === "OpenAI"
                        ? "#22C55E"
                        : g.gatewayName === "Gemini"
                            ? "#3B82F6"
                            : "#F59E0B";

                const status =
                    g.status === "UP"
                        ? "Online"
                        : "Down";

                const circuit =
                    g.circuitOpen
                        ? "OPEN"
                        : "CLOSED";

                return (

                    <div
                        className="gatewayCard"
                        key={g.id}
                        style={{
                            borderTop: `4px solid ${color}`
                        }}
                    >

                        <div className="gatewayHeader">

                            <div
                                className="gatewayIcon"
                                style={{
                                    background: color
                                }}
                            >
                                {providerIcons[g.gatewayName]}
                            </div>

                            <h2>
                                {g.gatewayName}
                            </h2>

                        </div>

                        <div className="infoRow">

                            <span>Status</span>

                            <strong>
                                {status}
                            </strong>

                        </div>

                        <div className="infoRow">

                            <span>Latency</span>

                            <strong>
                                {g.responseTime} ms
                            </strong>

                        </div>

                        <div className="infoRow">

                            <span>Cost</span>

                            <strong>
                                ${Number(g.cost).toFixed(3)}
                            </strong>

                        </div>

                        <div className="infoRow">

                            <span>Circuit Breaker</span>

                            <span
                                className={
                                    circuit === "CLOSED"
                                        ? "closedBadge"
                                        : "openBadge"
                                }
                            >
                                {circuit}
                            </span>

                        </div>

                    </div>

                );

            })}

        </div>

    );

}

export default GatewayManagementCards;