import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import { useEffect, useState } from "react";
import "../../styles/Analytics.css";


// =========================================
// Custom labels beside donut
// =========================================

const renderCustomizedLabel = (props) => {

    const {
        cx,
        cy,
        name,
        rawValue,
        total
    } = props;

    if (name === "No Data") {
        return null;
    }

    const percentage =
        total > 0
            ? Math.round((rawValue / total) * 100)
            : 0;

    const labelColor =
        name === "Successful"
            ? "#4EA346"
            : "#E13C3C";

    // -----------------------------------------
    // Keep labels safely inside the card
    // -----------------------------------------

    const isSuccessful =
        name === "Successful";

    // Short connecting line
    const lineStartX =
        isSuccessful
            ? cx - 90
            : cx + 90;

    const lineEndX =
        isSuccessful
            ? cx - 105
            : cx + 105;

    // Text position
    const textX =
        isSuccessful
            ? cx - 110
            : cx + 110;

    const lineY =
        cy - 5;

    const textAnchor =
        isSuccessful
            ? "end"
            : "start";

    return (
        <g>

            {/* Connecting line */}

            <line
                x1={lineStartX}
                y1={lineY}
                x2={lineEndX}
                y2={lineY}
                stroke={labelColor}
                strokeWidth={1.5}
            />

            {/* Name */}

            <text
                x={textX}
                y={lineY - 5}
                fill={labelColor}
                textAnchor={textAnchor}
                fontSize={12}
                fontWeight="500"
            >
                {name}
            </text>

            {/* Percentage */}

            <text
                x={textX}
                y={lineY + 11}
                fill="#FFFFFF"
                textAnchor={textAnchor}
                fontSize={13}
                fontWeight="bold"
            >
                {percentage}%
            </text>

        </g>
    );
};


// =========================================
// Success Rate Donut
// =========================================

function SuccessRateDonut() {

    const [stats, setStats] = useState({
        successful: 0,
        failed: 0
    });


    // =========================================
    // Fetch routing statistics
    // =========================================

    useEffect(() => {

        fetch(
            "http://localhost:8080/analytics/routing-success"
        )
            .then(response => {

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch routing statistics"
                    );
                }

                return response.json();
            })

            .then(data => {

                console.log(
                    "Routing statistics:",
                    data
                );

                setStats({
                    successful:
                        Number(data.successful || 0),

                    failed:
                        Number(data.failed || 0)
                });
            })

            .catch(error => {

                console.error(
                    "Error fetching routing statistics:",
                    error
                );

            });

    }, []);


    // =========================================
    // Total
    // =========================================

    const total =
        stats.successful + stats.failed;


    // =========================================
    // Keep zero category slightly visible
    // =========================================

    const displaySuccessful =
        stats.successful === 0 &&
        stats.failed > 0
            ? 0.02
            : stats.successful;


    const displayFailed =
        stats.failed === 0 &&
        stats.successful > 0
            ? 0.02
            : stats.failed;


    // =========================================
    // Chart data
    // =========================================

    const data =
        total > 0

            ? [
                {
                    name: "Successful",
                    value: displaySuccessful,
                    rawValue: stats.successful
                },

                {
                    name: "Failed",
                    value: displayFailed,
                    rawValue: stats.failed
                }
            ]

            : [
                {
                    name: "No Data",
                    value: 1,
                    rawValue: 0
                }
            ];


    // =========================================
    // Colors
    // =========================================

    const COLORS =
        total > 0

            ? [
                "#4EA346",
                "#E13C3C"
            ]

            : [
                "#64748B"
            ];


    // =========================================
    // Render
    // =========================================

    return (

        <div className="analyticsChart donutChart">

            {/* Header */}

            <div
                className="chartHeader"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline"
                }}
            >

                <h2>
                    Routing Success Rate
                </h2>

                <p>
                    Successful and failed routing decisions
                </p>

            </div>


            {/* Donut */}

            <div
                className="donutWrapper"
                style={{
                    width: "100%",
                    height: 280
                }}
            >

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <PieChart>

                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="48%"
                            innerRadius={65}
                            outerRadius={90}
                            stroke="#1E293B"
                            strokeWidth={1}
                            label={(props) =>
                                renderCustomizedLabel({
                                    ...props,
                                    total: total,
                                    rawValue: props.payload.rawValue
                                })
                            }
                            labelLine={false}
                            isAnimationActive={false}
                        >

                            {data.map(
                                (entry, index) => (

                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            COLORS[index]
                                        }
                                    />

                                )
                            )}

                        </Pie>


                        {/* Tooltip */}

                        <Tooltip
                            formatter={(
                                value,
                                name,
                                item
                            ) => [

                                item.payload.rawValue,
                                name

                            ]}
                        />

                    </PieChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}

export default SuccessRateDonut;