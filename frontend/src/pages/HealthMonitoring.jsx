import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "../styles/Layout.css";
import "../styles/HealthMonitoring.css";

function HealthMonitoring() {

    const [gateways, setGateways] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================================
    // FETCH GATEWAY HEALTH
    // =========================================

    const fetchGatewayHealth = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/gateways"
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch gateway health"
                );
            }

            const data = await response.json();

            setGateways(data);
            setError("");

        } catch (err) {

            console.error(
                "Gateway health error:",
                err
            );

            setError(
                "Unable to load gateway health"
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // INITIAL LOAD + LIVE REFRESH
    // =========================================

    useEffect(() => {

        fetchGatewayHealth();

        const interval = setInterval(
            fetchGatewayHealth,
            5000
        );

        return () => {
            clearInterval(interval);
        };

    }, []);


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="appLayout">

                <Sidebar />

                <div className="mainContent">

                    <Navbar
                        title="Health Monitoring"
                        subtitle="Monitor gateway health and operational status"
                    />

                    <div className="healthPage">

                        <div className="healthCards">

                            <div className="healthCard">

                                <h2>
                                    Loading gateway health...
                                </h2>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        );

    }


    // =========================================
    // ERROR
    // =========================================

    if (error) {

        return (

            <div className="appLayout">

                <Sidebar />

                <div className="mainContent">

                    <Navbar
                        title="Health Monitoring"
                        subtitle="Monitor gateway health and operational status"
                    />

                    <div className="healthPage">

                        <div className="healthCards">

                            <div className="healthCard">

                                <h2>
                                    Gateway Health Error
                                </h2>

                                <p>
                                    {error}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        );

    }


    // =========================================
    // RENDER
    // =========================================

    return (

        <div className="appLayout">

            <Sidebar />

            <div className="mainContent">

                <Navbar
                    title="Health Monitoring"
                    subtitle="Monitor gateway health and operational status"
                />

                <div className="healthPage">

                    <div className="healthCards">

                        {gateways.map((gateway) => {

                            // ---------------------------------
                            // Provider color
                            // ---------------------------------

                            const color =
                                gateway.gatewayName === "OpenAI"
                                    ? "#22C55E"
                                    : gateway.gatewayName === "Gemini"
                                        ? "#3B82F6"
                                        : "#F59E0B";


                            // ---------------------------------
                            // Gateway status
                            // ---------------------------------

                            const isUp =
                                gateway.status &&
                                gateway.status.toUpperCase() === "UP";

                            const status =
                                isUp
                                    ? "Online"
                                    : "Down";


                            const statusColor =
                                isUp
                                    ? "#22C55E"
                                    : "#EF4444";


                            // ---------------------------------
                            // Circuit breaker
                            // ---------------------------------

                            let circuit = "CLOSED";
                            let circuitClass = "closedHealth";

                            if (gateway.circuitOpen) {

                                circuit = "OPEN";
                                circuitClass = "openHealth";

                            }


                            // ---------------------------------
                            // Health
                            // ---------------------------------

                            const health =
                                Number(gateway.health);

                            const healthValue =
                                Number.isFinite(health)
                                    ? health.toFixed(1)
                                    : "—";


                            // ---------------------------------
                            // Latency
                            // ---------------------------------

                            const latency =
                                Number(
                                    gateway.responseTime
                                );

                            const latencyValue =
                                Number.isFinite(latency)
                                    ? `${latency.toFixed(0)} ms`
                                    : "—";


                            return (

                                <div
                                    className="healthCard"
                                    key={gateway.id}

                                    style={{
                                        borderTop:
                                            `4px solid ${color}`
                                    }}
                                >

                                    {/* Header */}

                                    <div className="healthCardHeader">

                                        <h2>
                                            {gateway.gatewayName}
                                        </h2>

                                        <span
                                            className="healthStatus"
                                            style={{
                                                color:
                                                statusColor
                                            }}
                                        >

                                            ● {status}

                                        </span>

                                    </div>


                                    {/* Health */}

                                    <div className="healthMetric">

                                        <span>
                                            Health
                                        </span>

                                        <strong>
                                            {healthValue}%
                                        </strong>

                                    </div>


                                    {/* Latency */}

                                    <div className="healthMetric">

                                        <span>
                                            Response Latency
                                        </span>

                                        <strong>
                                            {latencyValue}
                                        </strong>

                                    </div>


                                    {/* Failure Count */}

                                    <div className="healthMetric">

                                        <span>
                                            Failure Count
                                        </span>

                                        <strong>
                                            {gateway.failureCount ?? 0}
                                        </strong>

                                    </div>


                                    {/* Circuit Breaker */}

                                    <div className="healthMetric">

                                        <span>
                                            Circuit Breaker
                                        </span>

                                        <strong
                                            className={
                                                circuitClass
                                            }
                                        >
                                            {circuit}
                                        </strong>

                                    </div>


                                    {/* Circuit Open Time */}

                                    {gateway.circuitOpen &&
                                        gateway.circuitOpenedAt && (

                                            <div className="healthMetric">

                                                <span>
                                                    Circuit Opened
                                                </span>

                                                <strong>
                                                    {new Date(
                                                        gateway.circuitOpenedAt
                                                    ).toLocaleString()}
                                                </strong>

                                            </div>

                                        )}

                                </div>

                            );

                        })}

                    </div>

                </div>

            </div>

        </div>

    );

}

export default HealthMonitoring;