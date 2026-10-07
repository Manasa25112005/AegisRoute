import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import { useEffect, useState } from "react";

function ResponseTrendChart() {

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

            const chartData = gateways.map(gateway => ({
                gateway: gateway.gatewayName,
                latency: Number(gateway.responseTime || 0)
            }));

            setData(chartData);

        } catch (error) {

            console.error(
                "Error fetching gateway latency:",
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
                    Response Time Trend
                </h2>

                <p>
                    Current gateway response latency
                </p>

            </div>

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <LineChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 20,
                        left: 10,
                        bottom: 10
                    }}
                >

                    <CartesianGrid
                        strokeDasharray="3 3"
                    />

                    <XAxis
                        dataKey="gateway"
                    />

                    <YAxis
                        label={{
                            value: "Latency (ms)",
                            angle: -90,
                            position: "insideLeft"
                        }}
                    />

                    <Tooltip
                        formatter={(value) => [
                            `${value} ms`,
                            "Current Latency"
                        ]}
                    />

                    <Line
                        type="monotone"
                        dataKey="latency"
                        name="Current Latency"
                        stroke="#22D3EE"
                        strokeWidth={3}
                        dot={{ r: 6 }}
                        activeDot={{ r: 8 }}
                        isAnimationActive={false}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>
    );
}

export default ResponseTrendChart;