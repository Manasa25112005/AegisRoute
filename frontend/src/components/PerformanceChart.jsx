import { useEffect, useState } from "react";
import "../styles/Cards.css";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

const STORAGE_KEY =
    "aegisroute_performance_history";

const MAX_POINTS = 10;

function PerformanceChart() {

    const [data, setData] = useState([]);


    // =========================================
    // LOAD SAVED HISTORY
    // =========================================

    useEffect(() => {

        try {

            const saved =
                localStorage.getItem(
                    STORAGE_KEY
                );

            if (saved) {

                const parsed =
                    JSON.parse(saved);

                if (Array.isArray(parsed)) {

                    setData(
                        parsed.slice(-MAX_POINTS)
                    );

                }

            }

        } catch (error) {

            console.error(
                "Performance history error:",
                error
            );

        }

    }, []);


    // =========================================
    // FETCH LIVE GATEWAY LATENCY
    // =========================================

    const fetchGatewayData = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/gateways"
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch gateway data"
                );

            }

            const gateways =
                await response.json();


            // =================================
            // CURRENT TIME
            // =================================

            const now = new Date();

            const timestamp =
                now.getTime();

            const time =
                now.toLocaleTimeString(
                    "en-IN",
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true
                    }
                );


            // =================================
            // FIND GATEWAYS
            // =================================

            const openai =
                gateways.find(
                    gateway =>
                        gateway.gatewayName === "OpenAI"
                );

            const gemini =
                gateways.find(
                    gateway =>
                        gateway.gatewayName === "Gemini"
                );

            const claude =
                gateways.find(
                    gateway =>
                        gateway.gatewayName === "Claude"
                );


            // =================================
            // CREATE CHART POINT
            // =================================

            const point = {

                timestamp,

                time,

                openai: openai
                    ? Number(
                        openai.responseTime
                    )
                    : null,

                gemini: gemini
                    ? Number(
                        gemini.responseTime
                    )
                    : null,

                claude: claude
                    ? Number(
                        claude.responseTime
                    )
                    : null

            };


            console.log(
                "Live performance point:",
                point
            );


            // =================================
            // UPDATE HISTORY
            // =================================

            setData(previousData => {

                /*
                 * Prevent duplicate points if the
                 * same timestamp is accidentally
                 * generated.
                 */

                const filtered =
                    previousData.filter(
                        item =>
                            item.timestamp !==
                            point.timestamp
                    );


                const updatedData = [
                    ...filtered,
                    point
                ].slice(-MAX_POINTS);


                // Save chart history
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(
                        updatedData
                    )
                );


                return updatedData;

            });

        } catch (error) {

            console.error(
                "Performance chart error:",
                error
            );

        }

    };


    // =========================================
    // START LIVE MONITORING
    // =========================================

    useEffect(() => {

        /*
         * First measurement immediately.
         */

        fetchGatewayData();


        /*
         * Add a new measurement every
         * 10 seconds.
         */

        const interval =
            setInterval(
                fetchGatewayData,
                10000
            );


        return () => {

            clearInterval(interval);

        };

    }, []);


    // =========================================
    // RENDER
    // =========================================

    return (

        <div className="chartCard">

            <div className="chartHeader">

                <h3>
                    Gateway Performance Monitor
                </h3>


                <span className="liveStatus">

                    <span className="liveDot"></span>

                    Live Monitoring

                </span>

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
                        stroke="#1E293B"
                    />


                    <XAxis
                        dataKey="time"
                        stroke="#94A3B8"
                    />


                    <YAxis
                        stroke="#94A3B8"

                        label={{
                            value: "Latency (ms)",
                            angle: -90,
                            position: "insideLeft"
                        }}
                    />


                    <Tooltip
                        contentStyle={{
                            background: "#111827",
                            border:
                                "1px solid #334155",
                            borderRadius: "10px",
                            color: "#fff"
                        }}

                        formatter={(value, name) => [

                            `${value} ms`,

                            name

                        ]}
                    />


                    <Legend />


                    {/* =========================
                        OPENAI
                    ========================= */}

                    <Line
                        type="monotone"

                        dataKey="openai"

                        name="OpenAI"

                        stroke="#10B981"

                        strokeWidth={3}

                        dot={{
                            r: 4
                        }}

                        activeDot={{
                            r: 7
                        }}

                        connectNulls={false}

                        isAnimationActive={false}
                    />


                    {/* =========================
                        GEMINI
                    ========================= */}

                    <Line
                        type="monotone"

                        dataKey="gemini"

                        name="Gemini"

                        stroke="#22D3EE"

                        strokeWidth={3}

                        dot={{
                            r: 4
                        }}

                        activeDot={{
                            r: 7
                        }}

                        connectNulls={false}

                        isAnimationActive={false}
                    />


                    {/* =========================
                        CLAUDE
                    ========================= */}

                    <Line
                        type="monotone"

                        dataKey="claude"

                        name="Claude"

                        stroke="#FACC15"

                        strokeWidth={3}

                        dot={{
                            r: 4
                        }}

                        activeDot={{
                            r: 7
                        }}

                        connectNulls={false}

                        isAnimationActive={false}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    );

}

export default PerformanceChart;