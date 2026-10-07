import { useEffect, useState } from "react";
import "../../styles/Analytics.css";

function AnalyticsCards() {

    const [successRate, setSuccessRate] = useState(0);
    const [averageLatency, setAverageLatency] = useState(0);
    const [loading, setLoading] = useState(true);


    // =========================================
    // FETCH ANALYTICS DATA
    // =========================================

    const fetchAnalytics = async () => {

        try {

            const [
                successResponse,
                latencyResponse
            ] = await Promise.all([

                fetch(
                    "http://localhost:8080/analytics/routing-success"
                ),

                fetch(
                    "http://localhost:8080/analytics/average-latency"
                )

            ]);


            if (!successResponse.ok) {
                throw new Error(
                    "Failed to fetch success statistics"
                );
            }


            if (!latencyResponse.ok) {
                throw new Error(
                    "Failed to fetch average latency"
                );
            }


            const successData =
                await successResponse.json();

            const latencyData =
                await latencyResponse.json();


            setSuccessRate(
                Number(
                    successData.successRate || 0
                )
            );


            setAverageLatency(
                Number(
                    latencyData.averageLatency || 0
                )
            );


        } catch (error) {

            console.error(
                "Analytics error:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // INITIAL LOAD + REFRESH
    // =========================================

    useEffect(() => {

        fetchAnalytics();

        const interval =
            setInterval(
                fetchAnalytics,
                5000
            );

        return () => {

            clearInterval(interval);

        };

    }, []);


    // =========================================
    // CARDS
    // =========================================

    const cards = [

        {
            title: "Avg Request Latency",

            value: loading
                ? "..."
                : `${averageLatency.toFixed(1)} ms`,

            description:
                "Average latency of today's routing decisions",

            className: "latency"
        },


        {
            title: "Success Rate",

            value: loading
                ? "..."
                : `${successRate.toFixed(1)}%`,

            description:
                "Successful routing percentage",

            className: "success"
        },


        {
            title: "Average Cost",

            value: "$0.0000",

            description:
                "Cost tracking not yet stored per request",

            className: "cost"
        }

    ];


    // =========================================
    // RENDER
    // =========================================

    return (

        <div className="analyticsCards">

            {cards.map(
                (card, index) => (

                    <div
                        className={
                            `analyticsCard ${card.className}`
                        }

                        key={index}
                    >

                        <span
                            className="analyticsCardTitle"
                        >
                            {card.title}
                        </span>


                        <h2>
                            {card.value}
                        </h2>


                        <p>
                            {card.description}
                        </p>

                    </div>

                )
            )}

        </div>

    );

}

export default AnalyticsCards;