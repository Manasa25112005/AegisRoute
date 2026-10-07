import { useEffect, useState } from "react";
import "../styles/Cards.css";
import { FaCircle } from "react-icons/fa";
import { providerIcons } from "../data/providerIcons";

function GatewayCards() {

    const [gateways, setGateways] = useState([]);
    const [error, setError] = useState("");

    const providerColors = {
        OpenAI: "#10B981",
        Gemini: "#3B82F6",
        Claude: "#F59E0B"
    };

    const fetchGateways = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/gateways"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch gateways");
            }

            const data = await response.json();

            // Keep a consistent order
            const orderedGateways = [...data].sort((a, b) => {

                const order = {
                    OpenAI: 1,
                    Gemini: 2,
                    Claude: 3
                };

                return (
                    (order[a.gatewayName] || 99) -
                    (order[b.gatewayName] || 99)
                );

            });

            setGateways(orderedGateways);
            setError("");

        } catch (err) {

            console.error(
                "Gateway fetch error:",
                err
            );

            setError(err.message);

        }

    };


    useEffect(() => {

        fetchGateways();

        const interval = setInterval(
            fetchGateways,
            5000
        );

        return () => clearInterval(interval);

    }, []);


    if (error) {

        return (

            <div className="gatewayCard">

                <h3>Gateway Error</h3>

                <p>{error}</p>

            </div>

        );

    }


    if (gateways.length === 0) {

        return (

            <div className="gatewayCard">

                <h3>Loading Gateways...</h3>

            </div>

        );

    }


    return (

        <>

            {gateways.map((gateway) => {

                const providerColor =
                    providerColors[gateway.gatewayName]
                    || "#3B82F6";


                /*
                 * Gateway status
                 */

                let statusText = "Offline";
                let statusColor = "#EF4444";


                if (gateway.circuitOpen) {

                    statusText = "Limited";
                    statusColor = "#F59E0B";

                } else if (
                    gateway.status &&
                    gateway.status.toUpperCase() === "UP"
                ) {

                    statusText = "Online";
                    statusColor = "#10B981";

                }


                /*
                 * Gateway icon
                 */

                const icon =
                    providerIcons[gateway.gatewayName];


                /*
                 * Gateway metrics
                 */

                const latency =
                    Number(gateway.responseTime ?? 0);

                const health =
                    Number(gateway.health ?? 0);


                return (

                    <div
                        className="gatewayCard"
                        key={gateway.id}
                        style={{
                            borderTop:
                                `3px solid ${providerColor}`
                        }}
                    >

                        {/* Header */}

                        <div className="gatewayHeader">

                            <div
                                className="gatewayIcon"
                                style={{
                                    background:
                                    providerColor
                                }}
                            >

                                {icon}

                            </div>


                            <div>

                                <h3>
                                    {gateway.gatewayName}
                                </h3>


                                <span
                                    className="status"
                                    style={{
                                        color:
                                        statusColor
                                    }}
                                >

                                    <FaCircle
                                        style={{
                                            fontSize: 9,
                                            marginRight: 6
                                        }}
                                    />

                                    {statusText}

                                </span>

                            </div>

                        </div>


                        {/* Metrics */}

                        <div className="gatewayInfo">

                            <div>

                                <small>
                                    Latency
                                </small>

                                <h4>
                                    {latency.toFixed(0)} ms
                                </h4>

                            </div>


                            <div>

                                <small>
                                    Health
                                </small>

                                <h4>
                                    {health.toFixed(1)}%
                                </h4>

                            </div>

                        </div>

                    </div>

                );

            })}

        </>

    );

}

export default GatewayCards;