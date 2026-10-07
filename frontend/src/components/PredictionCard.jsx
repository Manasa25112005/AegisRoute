import { useEffect, useState } from "react";
import "../styles/Cards.css";
import {
    FaCheckCircle,
    FaTimesCircle,
} from "react-icons/fa";
import symbol from "../assets/images/symbol.jpeg";
import { providerIcons } from "../data/providerIcons";

function PredictionCard() {

    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState("");


    // =========================================
    // Fetch prediction
    // =========================================

    const fetchPrediction = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/route"
            );

            if (!response.ok) {

                throw new Error(
                    "Backend returned status " +
                    response.status
                );

            }

            const data = await response.json();

            console.log(
                "Prediction:",
                data
            );

            setPrediction(data);

            // Clear previous error
            setError("");

        } catch (error) {

            console.error(
                "Prediction error:",
                error
            );

            setError(
                error.message
            );
        }
    };


    // =========================================
    // Initial prediction + refresh
    // =========================================

    useEffect(() => {

        // Fetch immediately
        fetchPrediction();


        // Refresh every 30 seconds
        const interval = setInterval(
            fetchPrediction,
            30000
        );


        // Cleanup interval
        return () => {
            clearInterval(interval);
        };

    }, []);


    // =========================================
    // Error
    // =========================================

    if (error && !prediction) {

        return (

            <div className="routingCard">

                <h3>
                    Prediction Error
                </h3>

                <p>
                    {error}
                </p>

            </div>
        );
    }


    // =========================================
    // Loading
    // =========================================

    if (!prediction) {

        return (

            <div className="routingCard">

                <h3>
                    Loading prediction...
                </h3>

                <p>
                    Connecting to ML routing engine...
                </p>

            </div>
        );
    }


    // =========================================
    // Prediction data
    // =========================================

    const gateway =
        prediction.gateway;


    const providerIcon =
        providerIcons[
            gateway.gatewayName
            ];


    // =========================================
    // Render
    // =========================================

    return (

        <div className="routingCard">


            {/* Header */}

            <div className="routingHeader">

                <img
                    src={symbol}
                    alt="AegisRoute"
                    className="brainIcon"
                />

                <div>

                    <h3>
                        AI Routing Engine
                    </h3>

                    <p>
                        Real-time Gateway Selection
                    </p>

                </div>

            </div>


            {/* Selected Gateway */}

            <div className="selectedGateway">

                <span>
                    Selected Gateway
                </span>

                <h2 className="selectedGatewayName">

                    <span className="predictionProviderIcon">

                        {providerIcon}

                    </span>

                    {gateway.gatewayName}

                </h2>

            </div>


            {/* Routing Metrics */}

            <div className="routingMetrics">


                <div>

                    <span>
                        Routing Score
                    </span>

                    <strong>

                        {Number(
                            prediction.routingScore
                        ).toFixed(1)}

                    </strong>

                </div>


                <div>

                    <span>
                        Confidence
                    </span>

                    <strong>

                        {Number(
                            prediction.confidence
                        ).toFixed(1)}%

                    </strong>

                </div>


                <div>

                    <span>
                        Latency
                    </span>

                    <strong>

                        {gateway.responseTime} ms

                    </strong>

                </div>


                <div>

                    <span>
                        Estimated Cost
                    </span>

                    <strong>

                        $
                        {Number(
                            gateway.cost
                        ).toFixed(4)}

                    </strong>

                </div>

            </div>


            {/* Reason for Selection */}

            <div className="reasonSection">

                <h4>

                    <FaCheckCircle
                        color="#10B981"
                    />

                    Reason for Selection

                </h4>


                <ul>

                    <li>
                        Gateway selected by ML
                        routing engine
                    </li>

                    <li>

                        Gateway health:{" "}

                        {Number(
                            gateway.health
                        ).toFixed(1)}%

                    </li>

                    <li>

                        Circuit Breaker:{" "}

                        {gateway.circuitOpen
                            ? "OPEN"
                            : "CLOSED"}

                    </li>

                    <li>

                        Response latency:{" "}

                        {gateway.responseTime} ms

                    </li>

                </ul>

            </div>


            {/* Rejected Gateways */}

            <div className="reasonSection reject">

                <h4>

                    <FaTimesCircle
                        color="#EF4444"
                    />

                    Rejected Gateways

                </h4>


                <ul>

                    <li>
                        Other gateways were not
                        selected by the ML routing
                        prediction
                    </li>

                </ul>

            </div>

        </div>
    );
}


export default PredictionCard;