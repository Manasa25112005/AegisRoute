import { useEffect, useState } from "react";
import "../styles/Cards.css";

import {
    FaServer,
    FaCheckCircle,
    FaExchangeAlt,
    FaClock
} from "react-icons/fa";

function OverviewCards() {

    const [gateways, setGateways] = useState([]);
    const [requestsToday, setRequestsToday] = useState(0);
    const [loading, setLoading] = useState(true);


    // =========================================
    // FETCH GATEWAYS
    // =========================================

    const fetchGateways = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/gateways"
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch gateways"
                );

            }

            const data = await response.json();

            setGateways(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Gateway fetch error:",
                error
            );

        }

    };


    // =========================================
    // FETCH REQUESTS TODAY
    // =========================================

    const fetchRequestsToday = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/routing/requests/today"
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch request count"
                );

            }

            const data = await response.json();

            setRequestsToday(
                Number(data.count) || 0
            );

        } catch (error) {

            console.error(
                "Requests today error:",
                error
            );

        }

    };


    // =========================================
    // FETCH DASHBOARD DATA
    // =========================================

    const fetchDashboardData = async () => {

        try {

            setLoading(true);

            await Promise.all([
                fetchGateways(),
                fetchRequestsToday()
            ]);

        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // INITIAL LOAD + AUTO REFRESH
    // =========================================

    useEffect(() => {

        fetchDashboardData();

        const interval = setInterval(
            fetchDashboardData,
            5000
        );

        return () => {

            clearInterval(interval);

        };

    }, []);


    // =========================================
    // TOTAL GATEWAYS
    // =========================================

    const totalGateways =
        gateways.length;


    // =========================================
    // ACTIVE GATEWAYS
    // =========================================

    const activeGateways =
        gateways.filter(
            gateway => {

                const isUp =
                    gateway.status &&
                    gateway.status.toUpperCase() === "UP";

                const circuitClosed =
                    !gateway.circuitOpen;

                return (
                    isUp &&
                    circuitClosed
                );

            }
        ).length;


    // =========================================
    // HEALTH PERCENTAGE
    // =========================================

    const healthyPercentage =
        totalGateways > 0

            ? (
                (activeGateways /
                    totalGateways) * 100
            ).toFixed(1)

            : "0.0";


    // =========================================
    // CURRENT GATEWAY LATENCIES
    // =========================================

    const validLatencies =
        gateways
            .map(
                gateway =>
                    Number(
                        gateway.responseTime
                    )
            )
            .filter(
                latency =>
                    Number.isFinite(latency) &&
                    latency > 0
            );


    // =========================================
    // AVERAGE LATENCY
    // =========================================

    const averageLatency =
        validLatencies.length > 0

            ? Math.round(
                validLatencies.reduce(
                    (sum, latency) =>
                        sum + latency,
                    0
                ) /
                validLatencies.length
            )

            : 0;


    // =========================================
    // NAVIGATION
    // =========================================

    const navigateTo = path => {

        window.location.href = path;

    };


    // =========================================
    // OVERVIEW CARDS
    // =========================================

    const cards = [

        {
            title: "Total Gateways",

            value: loading
                ? "..."
                : String(
                    totalGateways
                ).padStart(2, "0"),

            change:
                `${totalGateways} configured`,

            icon: <FaServer />,

            color: "#3B82F6",

            path: "/gateway-management"

        },


        {
            title: "Active Gateways",

            value: loading
                ? "..."
                : String(
                    activeGateways
                ).padStart(2, "0"),

            change:
                `${healthyPercentage}% Healthy`,

            icon: <FaCheckCircle />,

            color: "#10B981",

            path: "/health-monitoring"

        },


        {
            title: "Requests Today",

            value: loading
                ? "..."
                : requestsToday.toLocaleString(),

            change:
                "Live routing decisions",

            icon: <FaExchangeAlt />,

            color: "#F59E0B",

            path: "/analytics"

        },


        {
            title: "Avg Gateway Latency",

            value: loading
                ? "..."
                : `${averageLatency} ms`,

            change:
                "Current gateway average",

            icon: <FaClock />,

            color: "#8B5CF6",

            path: "/analytics"

        }

    ];


    // =========================================
    // RENDER
    // =========================================

    return (

        <>

            {cards.map(
                (card, index) => (

                    <div
                        className="overviewCard"

                        key={index}

                        onClick={() =>
                            navigateTo(
                                card.path
                            )
                        }

                        style={{
                            borderTop:
                                `4px solid ${card.color}`,

                            cursor:
                                "pointer"
                        }}

                        title={
                            `Open ${card.title}`
                        }
                    >

                        {/* ICON */}

                        <div
                            className="cardIcon"

                            style={{
                                background:
                                card.color
                            }}
                        >

                            {card.icon}

                        </div>


                        {/* CONTENT */}

                        <div
                            className="cardContent"
                        >

                            <p>
                                {card.title}
                            </p>


                            <h2>
                                {card.value}
                            </h2>


                            <span
                                style={{
                                    color:
                                    card.color
                                }}
                            >
                                {card.change}
                            </span>

                        </div>

                    </div>

                )
            )}

        </>

    );

}

export default OverviewCards;