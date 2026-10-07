import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import { useEffect, useState } from "react";
import "../../styles/Analytics.css";

function LatencyComparison() {

    const [data, setData] = useState([]);


    const fetchGatewayData = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/gateways"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch gateway data");
            }

            const gateways = await response.json();

            const chartData = gateways.map(gateway => {

                const actualLatency =
                    Number(gateway.responseTime || 0);

                return {
                    gateway: gateway.gatewayName,

                    // Keep actual value
                    actualLatency: actualLatency,

                    // Use a maximum of 1000ms for the graph
                    latency:
                        actualLatency > 1000
                            ? 1000
                            : actualLatency
                };
            });

            console.log(
                "Latency comparison:",
                chartData
            );

            setData(chartData);

        } catch (error) {

            console.error(
                "Error fetching latency data:",
                error
            );

            setData([]);
        }
    };


    useEffect(() => {

        fetchGatewayData();

        const interval = setInterval(
            fetchGatewayData,
            30000
        );

        return () => {
            clearInterval(interval);
        };

    }, []);


    return (

        <div className="analyticsChart">

            <div className="chartHeader">

                <h2>
                    Latency Comparison
                </h2>

                <p>
                    Current response latency by gateway
                </p>

            </div>


            <ResponsiveContainer
                width="100%"
                height={350}
            >

                <BarChart
                    data={data}

                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20
                    }}
                >

                    <CartesianGrid
                        strokeDasharray="3 3"
                    />


                    <XAxis
                        dataKey="gateway"
                    />


                    <YAxis
                        domain={[0, 1000]}
                        label={{
                            value: "Latency (ms)",
                            angle: -90,
                            position: "insideLeft"
                        }}
                    />


                    <Tooltip
                        formatter={(
                            value,
                            name,
                            item
                        ) => {

                            const actual =
                                item.payload.actualLatency;

                            return [
                                `${actual} ms`,
                                "Latency"
                            ];
                        }}
                    />


                    <Bar
                        dataKey="latency"
                        name="Latency"
                        fill="#38BDF8"
                        radius={[
                            6,
                            6,
                            0,
                            0
                        ]}
                        isAnimationActive={false}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>
    );
}

export default LatencyComparison;